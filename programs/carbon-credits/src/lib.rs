use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo, Burn};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("CCTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

#[program]
pub mod carbon_credits {
    use super::*;

    /// Initialize the CCT token mint
    pub fn initialize_mint(ctx: Context<InitializeMint>) -> Result<()> {
        msg!("CCT Token Mint initialized");
        Ok(())
    }

    /// Register a new industry with verification NFT
    pub fn register_industry(
        ctx: Context<RegisterIndustry>,
        company_name: String,
        bond_amount: u64,
    ) -> Result<()> {
        let industry = &mut ctx.accounts.industry_account;

        require!(bond_amount >= 1_000_000_000, ErrorCode::InsufficientBond); // Min 1000 USDC

        industry.authority = ctx.accounts.authority.key();
        industry.company_name = company_name;
        industry.bond_amount = bond_amount;
        industry.verified = false;
        industry.cct_balance = 0;
        industry.total_purchased = 0;
        industry.total_burned = 0;
        industry.compliance_status = ComplianceStatus::Pending;
        industry.created_at = Clock::get()?.unix_timestamp;

        msg!("Industry registered: {}", industry.company_name);
        Ok(())
    }

    /// Verify an industry and mint verification NFT
    pub fn verify_industry(ctx: Context<VerifyIndustry>) -> Result<()> {
        let industry = &mut ctx.accounts.industry_account;

        require!(!industry.verified, ErrorCode::AlreadyVerified);

        industry.verified = true;
        industry.compliance_status = ComplianceStatus::Compliant;

        msg!("Industry verified: {}", industry.company_name);
        Ok(())
    }

    /// Deposit bond (USDC) to vault
    pub fn deposit_bond(ctx: Context<DepositBond>, amount: u64) -> Result<()> {
        let industry = &mut ctx.accounts.industry_account;

        require!(industry.verified, ErrorCode::NotVerified);

        // Transfer USDC to bond vault
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.user_usdc.to_account_info(),
                    to: ctx.accounts.bond_vault.to_account_info(),
                    authority: ctx.accounts.authority.to_account_info(),
                },
            ),
            amount,
        )?;

        industry.bond_amount += amount;

        msg!("Bond deposited: {} USDC", amount);
        Ok(())
    }

    /// Purchase CCT tokens (mint to industry)
    pub fn purchase_cct(ctx: Context<PurchaseCCT>, amount: u64) -> Result<()> {
        let industry = &mut ctx.accounts.industry_account;

        require!(industry.verified, ErrorCode::NotVerified);

        // Mint CCT tokens to industry's account
        let seeds = &[
            b"mint_authority",
            &[ctx.bumps.mint_authority],
        ];
        let signer = &[&seeds[..]];

        token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.cct_mint.to_account_info(),
                    to: ctx.accounts.industry_cct_account.to_account_info(),
                    authority: ctx.accounts.mint_authority.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;

        industry.cct_balance += amount;
        industry.total_purchased += amount;

        msg!("CCT purchased: {} tokens", amount);
        Ok(())
    }

    /// Burn CCT tokens for compliance
    pub fn burn_cct_for_compliance(
        ctx: Context<BurnCCT>,
        amount: u64,
        emission_amount: u64,
    ) -> Result<()> {
        let industry = &mut ctx.accounts.industry_account;

        require!(industry.verified, ErrorCode::NotVerified);
        require!(industry.cct_balance >= amount, ErrorCode::InsufficientCCT);

        // Burn CCT tokens
        token::burn(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Burn {
                    mint: ctx.accounts.cct_mint.to_account_info(),
                    from: ctx.accounts.industry_cct_account.to_account_info(),
                    authority: ctx.accounts.authority.to_account_info(),
                },
            ),
            amount,
        )?;

        industry.cct_balance -= amount;
        industry.total_burned += amount;

        // Check compliance
        if amount >= emission_amount {
            industry.compliance_status = ComplianceStatus::Compliant;
        } else {
            industry.compliance_status = ComplianceStatus::NonCompliant;
        }

        msg!("CCT burned for compliance: {} tokens", amount);
        Ok(())
    }

    /// Submit emission report
    pub fn submit_emission_report(
        ctx: Context<SubmitEmissionReport>,
        co2_emitted: u64,
        report_period: String,
    ) -> Result<()> {
        let report = &mut ctx.accounts.emission_report;

        report.industry = ctx.accounts.industry_account.key();
        report.co2_emitted = co2_emitted;
        report.report_period = report_period;
        report.submitted_at = Clock::get()?.unix_timestamp;
        report.verified = false;

        msg!("Emission report submitted: {} tonnes CO2", co2_emitted);
        Ok(())
    }

    /// Withdraw bond (only if exiting program)
    pub fn withdraw_bond(ctx: Context<WithdrawBond>, amount: u64) -> Result<()> {
        let industry = &mut ctx.accounts.industry_account;

        require!(
            industry.compliance_status == ComplianceStatus::Compliant,
            ErrorCode::NotCompliant
        );
        require!(industry.bond_amount >= amount, ErrorCode::InsufficientBond);

        // Transfer USDC from vault back to user
        let seeds = &[
            b"bond_vault_authority",
            &[ctx.bumps.vault_authority],
        ];
        let signer = &[&seeds[..]];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.bond_vault.to_account_info(),
                    to: ctx.accounts.user_usdc.to_account_info(),
                    authority: ctx.accounts.vault_authority.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;

        industry.bond_amount -= amount;

        msg!("Bond withdrawn: {} USDC", amount);
        Ok(())
    }
}

// ============================================================================
// Contexts
// ============================================================================

#[derive(Accounts)]
pub struct InitializeMint<'info> {
    #[account(
        init,
        payer = authority,
        mint::decimals = 9,
        mint::authority = mint_authority,
    )]
    pub cct_mint: Account<'info, Mint>,

    /// CHECK: PDA authority for minting
    #[account(
        seeds = [b"mint_authority"],
        bump,
    )]
    pub mint_authority: UncheckedAccount<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct RegisterIndustry<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + IndustryAccount::INIT_SPACE,
        seeds = [b"industry", authority.key().as_ref()],
        bump,
    )]
    pub industry_account: Account<'info, IndustryAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifyIndustry<'info> {
    #[account(
        mut,
        seeds = [b"industry", industry_account.authority.as_ref()],
        bump,
    )]
    pub industry_account: Account<'info, IndustryAccount>,

    /// CHECK: Admin authority (would be multisig in production)
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct DepositBond<'info> {
    #[account(
        mut,
        seeds = [b"industry", authority.key().as_ref()],
        bump,
    )]
    pub industry_account: Account<'info, IndustryAccount>,

    #[account(mut)]
    pub user_usdc: Account<'info, TokenAccount>,

    #[account(mut)]
    pub bond_vault: Account<'info, TokenAccount>,

    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct PurchaseCCT<'info> {
    #[account(
        mut,
        seeds = [b"industry", authority.key().as_ref()],
        bump,
    )]
    pub industry_account: Account<'info, IndustryAccount>,

    #[account(mut)]
    pub cct_mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = cct_mint,
        associated_token::authority = authority,
    )]
    pub industry_cct_account: Account<'info, TokenAccount>,

    /// CHECK: Mint authority PDA
    #[account(
        seeds = [b"mint_authority"],
        bump,
    )]
    pub mint_authority: UncheckedAccount<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BurnCCT<'info> {
    #[account(
        mut,
        seeds = [b"industry", authority.key().as_ref()],
        bump,
    )]
    pub industry_account: Account<'info, IndustryAccount>,

    #[account(mut)]
    pub cct_mint: Account<'info, Mint>,

    #[account(mut)]
    pub industry_cct_account: Account<'info, TokenAccount>,

    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct SubmitEmissionReport<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + EmissionReport::INIT_SPACE,
        seeds = [
            b"emission_report",
            industry_account.key().as_ref(),
            &Clock::get()?.unix_timestamp.to_le_bytes()
        ],
        bump,
    )]
    pub emission_report: Account<'info, EmissionReport>,

    #[account(
        seeds = [b"industry", authority.key().as_ref()],
        bump,
    )]
    pub industry_account: Account<'info, IndustryAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawBond<'info> {
    #[account(
        mut,
        seeds = [b"industry", authority.key().as_ref()],
        bump,
    )]
    pub industry_account: Account<'info, IndustryAccount>,

    #[account(mut)]
    pub bond_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user_usdc: Account<'info, TokenAccount>,

    /// CHECK: Vault authority PDA
    #[account(
        seeds = [b"bond_vault_authority"],
        bump,
    )]
    pub vault_authority: UncheckedAccount<'info>,

    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

// ============================================================================
// Accounts
// ============================================================================

#[account]
#[derive(InitSpace)]
pub struct IndustryAccount {
    pub authority: Pubkey,
    #[max_len(100)]
    pub company_name: String,
    pub bond_amount: u64,
    pub verified: bool,
    pub cct_balance: u64,
    pub total_purchased: u64,
    pub total_burned: u64,
    pub compliance_status: ComplianceStatus,
    pub created_at: i64,
}

#[account]
#[derive(InitSpace)]
pub struct EmissionReport {
    pub industry: Pubkey,
    pub co2_emitted: u64,
    #[max_len(20)]
    pub report_period: String,
    pub submitted_at: i64,
    pub verified: bool,
}

// ============================================================================
// Enums
// ============================================================================

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum ComplianceStatus {
    Pending,
    Compliant,
    NonCompliant,
    Warning,
}

// ============================================================================
// Errors
// ============================================================================

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient bond amount. Minimum 1000 USDC required.")]
    InsufficientBond,

    #[msg("Industry is not verified yet.")]
    NotVerified,

    #[msg("Industry is already verified.")]
    AlreadyVerified,

    #[msg("Insufficient CCT balance.")]
    InsufficientCCT,

    #[msg("Industry is not compliant. Cannot withdraw bond.")]
    NotCompliant,
}
