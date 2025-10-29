use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("AUCTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

#[program]
pub mod dutch_auction {
    use super::*;

    /// Initialize a new Dutch auction
    pub fn create_auction(
        ctx: Context<CreateAuction>,
        batch_number: u32,
        total_tokens: u64,
        start_price: u64,      // In lamports (USDC)
        reserve_price: u64,     // Minimum price
        duration_seconds: i64,  // Auction duration
    ) -> Result<()> {
        let auction = &mut ctx.accounts.auction;
        let clock = Clock::get()?;

        require!(start_price > reserve_price, ErrorCode::InvalidPricing);
        require!(duration_seconds > 0, ErrorCode::InvalidDuration);

        auction.authority = ctx.accounts.authority.key();
        auction.batch_number = batch_number;
        auction.total_tokens = total_tokens;
        auction.tokens_remaining = total_tokens;
        auction.start_price = start_price;
        auction.current_price = start_price;
        auction.reserve_price = reserve_price;
        auction.start_time = clock.unix_timestamp;
        auction.end_time = clock.unix_timestamp + duration_seconds;
        auction.status = AuctionStatus::Active;
        auction.total_raised = 0;
        auction.participant_count = 0;

        msg!("Dutch auction #{} created: {} CCT tokens", batch_number, total_tokens);
        Ok(())
    }

    /// Place a bid in the auction
    pub fn place_bid(
        ctx: Context<PlaceBid>,
        token_amount: u64,
    ) -> Result<()> {
        let auction = &mut ctx.accounts.auction;
        let bid = &mut ctx.accounts.bid;
        let clock = Clock::get()?;

        require!(auction.status == AuctionStatus::Active, ErrorCode::AuctionNotActive);
        require!(clock.unix_timestamp < auction.end_time, ErrorCode::AuctionEnded);
        require!(token_amount <= auction.tokens_remaining, ErrorCode::InsufficientTokens);

        // Calculate current price based on linear decay
        let current_price = calculate_current_price(
            auction.start_price,
            auction.reserve_price,
            auction.start_time,
            auction.end_time,
            clock.unix_timestamp,
        )?;

        auction.current_price = current_price;

        let total_cost = token_amount
            .checked_mul(current_price)
            .ok_or(ErrorCode::MathOverflow)?;

        // Transfer USDC from bidder to escrow
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.bidder_usdc.to_account_info(),
                    to: ctx.accounts.escrow_usdc.to_account_info(),
                    authority: ctx.accounts.bidder.to_account_info(),
                },
            ),
            total_cost,
        )?;

        // Record bid
        bid.auction = auction.key();
        bid.bidder = ctx.accounts.bidder.key();
        bid.token_amount = token_amount;
        bid.price_per_token = current_price;
        bid.total_cost = total_cost;
        bid.timestamp = clock.unix_timestamp;
        bid.status = BidStatus::Pending;

        // Update auction state
        auction.tokens_remaining -= token_amount;
        auction.total_raised += total_cost;
        auction.participant_count += 1;

        // Check if auction should close
        if auction.tokens_remaining == 0 {
            auction.status = AuctionStatus::Completed;
        }

        msg!("Bid placed: {} CCT at {} USDC/token", token_amount, current_price);
        Ok(())
    }

    /// Finalize auction and distribute tokens
    pub fn finalize_auction(ctx: Context<FinalizeAuction>) -> Result<()> {
        let auction = &mut ctx.accounts.auction;
        let clock = Clock::get()?;

        require!(
            auction.status == AuctionStatus::Active || auction.status == AuctionStatus::Completed,
            ErrorCode::InvalidAuctionStatus
        );
        require!(
            clock.unix_timestamp >= auction.end_time || auction.tokens_remaining == 0,
            ErrorCode::AuctionNotEnded
        );

        // Calculate clearing price (last accepted bid price or reserve)
        let clearing_price = if auction.tokens_remaining == 0 {
            auction.current_price
        } else {
            auction.reserve_price
        };

        auction.status = AuctionStatus::Finalized;
        auction.current_price = clearing_price;

        msg!("Auction #{} finalized. Clearing price: {}", auction.batch_number, clearing_price);
        Ok(())
    }

    /// Claim tokens after auction finalization
    pub fn claim_tokens(ctx: Context<ClaimTokens>) -> Result<()> {
        let auction = &ctx.accounts.auction;
        let bid = &mut ctx.accounts.bid;

        require!(auction.status == AuctionStatus::Finalized, ErrorCode::AuctionNotFinalized);
        require!(bid.status == BidStatus::Pending, ErrorCode::BidAlreadyProcessed);

        let clearing_price = auction.current_price;
        let refund_amount = bid
            .total_cost
            .checked_sub(bid.token_amount * clearing_price)
            .ok_or(ErrorCode::MathOverflow)?;

        // Refund excess USDC if bid price > clearing price
        if refund_amount > 0 {
            let seeds = &[
                b"escrow_authority",
                auction.key().as_ref(),
                &[ctx.bumps.escrow_authority],
            ];
            let signer = &[&seeds[..]];

            token::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.escrow_usdc.to_account_info(),
                        to: ctx.accounts.bidder_usdc.to_account_info(),
                        authority: ctx.accounts.escrow_authority.to_account_info(),
                    },
                    signer,
                ),
                refund_amount,
            )?;
        }

        bid.status = BidStatus::Accepted;

        msg!("Tokens claimed: {} CCT, refund: {} USDC", bid.token_amount, refund_amount);
        Ok(())
    }

    /// Cancel auction (admin only, before any bids)
    pub fn cancel_auction(ctx: Context<CancelAuction>) -> Result<()> {
        let auction = &mut ctx.accounts.auction;

        require!(auction.status == AuctionStatus::Active, ErrorCode::InvalidAuctionStatus);
        require!(auction.participant_count == 0, ErrorCode::HasParticipants);

        auction.status = AuctionStatus::Cancelled;

        msg!("Auction #{} cancelled", auction.batch_number);
        Ok(())
    }
}

// ============================================================================
// Helper Functions
// ============================================================================

fn calculate_current_price(
    start_price: u64,
    reserve_price: u64,
    start_time: i64,
    end_time: i64,
    current_time: i64,
) -> Result<u64> {
    if current_time >= end_time {
        return Ok(reserve_price);
    }

    if current_time <= start_time {
        return Ok(start_price);
    }

    let duration = end_time - start_time;
    let elapsed = current_time - start_time;
    let price_range = start_price - reserve_price;

    // Linear decay: price = start_price - (price_range * elapsed / duration)
    let decay = (price_range as u128)
        .checked_mul(elapsed as u128)
        .ok_or(ErrorCode::MathOverflow)?
        .checked_div(duration as u128)
        .ok_or(ErrorCode::MathOverflow)? as u64;

    let current_price = start_price
        .checked_sub(decay)
        .ok_or(ErrorCode::MathOverflow)?;

    Ok(current_price.max(reserve_price))
}

// ============================================================================
// Contexts
// ============================================================================

#[derive(Accounts)]
#[instruction(batch_number: u32)]
pub struct CreateAuction<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Auction::INIT_SPACE,
        seeds = [b"auction", &batch_number.to_le_bytes()],
        bump,
    )]
    pub auction: Account<'info, Auction>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceBid<'info> {
    #[account(
        mut,
        seeds = [b"auction", &auction.batch_number.to_le_bytes()],
        bump,
    )]
    pub auction: Account<'info, Auction>,

    #[account(
        init,
        payer = bidder,
        space = 8 + Bid::INIT_SPACE,
        seeds = [
            b"bid",
            auction.key().as_ref(),
            bidder.key().as_ref(),
            &Clock::get()?.unix_timestamp.to_le_bytes()
        ],
        bump,
    )]
    pub bid: Account<'info, Bid>,

    #[account(mut)]
    pub bidder_usdc: Account<'info, TokenAccount>,

    #[account(mut)]
    pub escrow_usdc: Account<'info, TokenAccount>,

    #[account(mut)]
    pub bidder: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FinalizeAuction<'info> {
    #[account(
        mut,
        seeds = [b"auction", &auction.batch_number.to_le_bytes()],
        bump,
    )]
    pub auction: Account<'info, Auction>,

    /// CHECK: Admin authority
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimTokens<'info> {
    #[account(
        seeds = [b"auction", &auction.batch_number.to_le_bytes()],
        bump,
    )]
    pub auction: Account<'info, Auction>,

    #[account(mut)]
    pub bid: Account<'info, Bid>,

    #[account(mut)]
    pub escrow_usdc: Account<'info, TokenAccount>,

    #[account(mut)]
    pub bidder_usdc: Account<'info, TokenAccount>,

    /// CHECK: Escrow authority PDA
    #[account(
        seeds = [b"escrow_authority", auction.key().as_ref()],
        bump,
    )]
    pub escrow_authority: UncheckedAccount<'info>,

    pub bidder: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CancelAuction<'info> {
    #[account(
        mut,
        seeds = [b"auction", &auction.batch_number.to_le_bytes()],
        bump,
    )]
    pub auction: Account<'info, Auction>,

    /// CHECK: Admin authority
    pub authority: Signer<'info>,
}

// ============================================================================
// Accounts
// ============================================================================

#[account]
#[derive(InitSpace)]
pub struct Auction {
    pub authority: Pubkey,
    pub batch_number: u32,
    pub total_tokens: u64,
    pub tokens_remaining: u64,
    pub start_price: u64,
    pub current_price: u64,
    pub reserve_price: u64,
    pub start_time: i64,
    pub end_time: i64,
    pub status: AuctionStatus,
    pub total_raised: u64,
    pub participant_count: u32,
}

#[account]
#[derive(InitSpace)]
pub struct Bid {
    pub auction: Pubkey,
    pub bidder: Pubkey,
    pub token_amount: u64,
    pub price_per_token: u64,
    pub total_cost: u64,
    pub timestamp: i64,
    pub status: BidStatus,
}

// ============================================================================
// Enums
// ============================================================================

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum AuctionStatus {
    Active,
    Completed,
    Finalized,
    Cancelled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum BidStatus {
    Pending,
    Accepted,
    Refunded,
}

// ============================================================================
// Errors
// ============================================================================

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid pricing: start price must be greater than reserve price")]
    InvalidPricing,

    #[msg("Invalid duration: must be greater than 0")]
    InvalidDuration,

    #[msg("Auction is not active")]
    AuctionNotActive,

    #[msg("Auction has already ended")]
    AuctionEnded,

    #[msg("Insufficient tokens remaining")]
    InsufficientTokens,

    #[msg("Math overflow occurred")]
    MathOverflow,

    #[msg("Invalid auction status for this operation")]
    InvalidAuctionStatus,

    #[msg("Auction has not ended yet")]
    AuctionNotEnded,

    #[msg("Auction has not been finalized yet")]
    AuctionNotFinalized,

    #[msg("Bid has already been processed")]
    BidAlreadyProcessed,

    #[msg("Cannot cancel auction with participants")]
    HasParticipants,
}
