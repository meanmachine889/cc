# CarbonOnChain Smart Contracts

Solana smart contracts (Anchor programs) for the CarbonOnChain platform.

---

## 📦 Programs

### 1. **Carbon Credits Program** (`carbon-credits`)

Main program managing CCT tokens, industry onboarding, and compliance.

**Features:**
- ✅ Industry registration with PDA accounts
- ✅ CCT token minting/burning
- ✅ Bond deposits (USDC) with tracking
- ✅ Emission report submission
- ✅ Compliance status management
- ✅ Verification system

**Instructions:**
1. `initialize_mint` - Create CCT token mint
2. `register_industry` - Register new industry
3. `verify_industry` - Verify industry (admin)
4. `deposit_bond` - Deposit USDC bond
5. `purchase_cct` - Mint CCT tokens to industry
6. `burn_cct_for_compliance` - Burn CCT for emissions
7. `submit_emission_report` - Submit CO₂ report
8. `withdraw_bond` - Withdraw bond (if compliant)

### 2. **Dutch Auction Program** (`dutch-auction`)

Handles Dutch auction mechanism for CCT distribution.

**Features:**
- ✅ Linear price decay over time
- ✅ Bid placement with USDC escrow
- ✅ Automatic refunds at clearing price
- ✅ Fair price discovery
- ✅ Batch management

**Instructions:**
1. `create_auction` - Initialize new auction
2. `place_bid` - Place bid at current price
3. `finalize_auction` - End auction & set clearing price
4. `claim_tokens` - Claim CCT + refund excess USDC
5. `cancel_auction` - Cancel auction (admin, no bids)

---

## 🏗️ Architecture

```
CarbonOnChain/
├── programs/
│   ├── carbon-credits/
│   │   ├── Cargo.toml
│   │   └── src/
│   │       └── lib.rs         # Main CCT program
│   └── dutch-auction/
│       ├── Cargo.toml
│       └── src/
│           └── lib.rs         # Auction program
├── Anchor.toml                # Workspace config
└── CONTRACTS_README.md        # This file
```

---

## 🚀 Getting Started

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install 0.30.1
avm use 0.30.1
```

### Build Programs

```bash
# Build all programs
anchor build

# Build specific program
cargo build-bpf --manifest-path=programs/carbon-credits/Cargo.toml
```

### Generate Program IDs

```bash
# Generate new keypairs
solana-keygen new -o target/deploy/carbon_credits-keypair.json
solana-keygen new -o target/deploy/dutch_auction-keypair.json

# Get program IDs
solana address -k target/deploy/carbon_credits-keypair.json
solana address -k target/deploy/dutch_auction-keypair.json

# Update declare_id!() in each lib.rs file
```

### Deploy to Devnet

```bash
# Set Solana to devnet
solana config set --url https://api.devnet.solana.com

# Airdrop SOL for deployment
solana airdrop 2

# Deploy programs
anchor deploy

# Or deploy individually
solana program deploy target/deploy/carbon_credits.so
solana program deploy target/deploy/dutch_auction.so
```

---

## 🔑 Account Structure

### Carbon Credits Program

**Industry Account (PDA)**
```rust
seeds: ["industry", authority.key()]

Fields:
- authority: Pubkey        // Owner wallet
- company_name: String     // Company name
- bond_amount: u64         // USDC bonded
- verified: bool           // Verification status
- cct_balance: u64         // CCT tokens held
- total_purchased: u64     // Total CCT purchased
- total_burned: u64        // Total CCT burned
- compliance_status: enum  // Compliance state
- created_at: i64          // Unix timestamp
```

**Emission Report (PDA)**
```rust
seeds: ["emission_report", industry.key(), timestamp]

Fields:
- industry: Pubkey         // Industry account
- co2_emitted: u64         // Tonnes of CO₂
- report_period: String    // e.g., "2025-01"
- submitted_at: i64        // Submission time
- verified: bool           // Verification status
```

### Dutch Auction Program

**Auction Account (PDA)**
```rust
seeds: ["auction", batch_number]

Fields:
- authority: Pubkey        // Admin
- batch_number: u32        // Auction ID
- total_tokens: u64        // Total CCT
- tokens_remaining: u64    // Available CCT
- start_price: u64         // Starting USDC price
- current_price: u64       // Current USDC price
- reserve_price: u64       // Minimum USDC price
- start_time: i64          // Start timestamp
- end_time: i64            // End timestamp
- status: enum             // Auction status
- total_raised: u64        // USDC raised
- participant_count: u32   // Number of bidders
```

**Bid Account (PDA)**
```rust
seeds: ["bid", auction.key(), bidder.key(), timestamp]

Fields:
- auction: Pubkey          // Auction account
- bidder: Pubkey           // Bidder wallet
- token_amount: u64        // CCT amount
- price_per_token: u64     // Bid price
- total_cost: u64          // Total USDC paid
- timestamp: i64           // Bid time
- status: enum             // Bid status
```

---

## 💡 Usage Examples

### Initialize CCT Token

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CarbonCredits } from "../target/types/carbon_credits";

const program = anchor.workspace.CarbonCredits as Program<CarbonCredits>;

await program.methods
  .initializeMint()
  .accounts({
    cctMint: mintKeypair.publicKey,
    mintAuthority: mintAuthorityPDA,
    authority: provider.wallet.publicKey,
  })
  .signers([mintKeypair])
  .rpc();
```

### Register Industry

```typescript
const [industryPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("industry"), wallet.publicKey.toBuffer()],
  program.programId
);

await program.methods
  .registerIndustry("Acme Industries Ltd.", new anchor.BN(10_000_000_000))
  .accounts({
    industryAccount: industryPDA,
    authority: wallet.publicKey,
  })
  .rpc();
```

### Create Dutch Auction

```typescript
const auctionProgram = anchor.workspace.DutchAuction;

const [auctionPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("auction"), Buffer.from([42])], // Batch #42
  auctionProgram.programId
);

await auctionProgram.methods
  .createAuction(
    42,                              // batch_number
    new anchor.BN(1000_000_000_000), // 1000 CCT (9 decimals)
    new anchor.BN(50_000_000),       // $50 start price
    new anchor.BN(10_000_000),       // $10 reserve price
    new anchor.BN(86400)             // 24 hours
  )
  .accounts({
    auction: auctionPDA,
    authority: wallet.publicKey,
  })
  .rpc();
```

### Place Bid in Auction

```typescript
await auctionProgram.methods
  .placeBid(new anchor.BN(10_000_000_000)) // 10 CCT
  .accounts({
    auction: auctionPDA,
    bid: bidPDA,
    bidderUsdc: bidderUsdcAccount,
    escrowUsdc: escrowUsdcAccount,
    bidder: wallet.publicKey,
  })
  .rpc();
```

---

## 🧪 Testing

### Write Tests

Create `tests/carbon-credits.ts`:

```typescript
import * as anchor from "@coral-xyz/anchor";
import { assert } from "chai";

describe("carbon-credits", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.CarbonCredits;

  it("Registers an industry", async () => {
    const tx = await program.methods
      .registerIndustry("Test Co", new anchor.BN(5000_000_000))
      .rpc();

    console.log("Transaction signature:", tx);
  });

  it("Purchases CCT tokens", async () => {
    // Test implementation
  });
});
```

### Run Tests

```bash
# Run all tests
anchor test

# Run with logs
anchor test -- --features "test-sbf"

# Run specific test file
anchor test --skip-build tests/carbon-credits.ts
```

---

## 🔐 Security Considerations

### ⚠️ Important Notes

1. **Program IDs**
   - Replace placeholder IDs in `declare_id!()` with actual deployed addresses
   - Update `Anchor.toml` with real program IDs

2. **Admin Authority**
   - `verify_industry` requires admin signature
   - `finalize_auction` requires admin signature
   - Use multisig for production admin wallet

3. **Bond Vault**
   - Implement proper vault authority PDA
   - Ensure only compliant industries can withdraw
   - Consider timelock mechanisms

4. **Price Calculations**
   - Dutch auction uses integer math (no floats)
   - All prices in lamports (1 USDC = 1_000_000)
   - Check for overflow/underflow

5. **Testing**
   - Test all edge cases
   - Audit before mainnet deployment
   - Use devnet extensively

---

## 📊 Dutch Auction Price Formula

```rust
// Linear decay over time
price = start_price - (price_range * elapsed / duration)

where:
- price_range = start_price - reserve_price
- elapsed = current_time - start_time
- duration = end_time - start_time
```

**Example:**
- Start: $50/CCT at t=0
- Reserve: $10/CCT at t=24h
- After 12h: $30/CCT
- After 24h: $10/CCT (minimum)

---

## 🔄 Integration with Frontend

### Generate TypeScript Types

```bash
# Build and generate IDLs
anchor build

# IDLs will be in:
# target/idl/carbon_credits.json
# target/idl/dutch_auction.json
```

### Use in Next.js

```typescript
// src/lib/anchor-client.ts
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import idl from "../../target/idl/carbon_credits.json";

export function useProgram() {
  const wallet = useAnchorWallet();
  const connection = new Connection("https://api.devnet.solana.com");

  if (!wallet) return null;

  const provider = new AnchorProvider(connection, wallet, {});
  const program = new Program(idl, provider);

  return program;
}
```

---

## 🚧 Roadmap

### Phase 1 (Current)
- ✅ Core CCT program structure
- ✅ Dutch auction mechanism
- ✅ Basic compliance tracking

### Phase 2
- ⬜ DAMM vault integration
- ⬜ Yield distribution logic
- ⬜ NFT verification badges
- ⬜ Governance module

### Phase 3
- ⬜ Oracle integration for CO₂ prices
- ⬜ Cross-program invocations
- ⬜ Advanced compliance algorithms
- ⬜ Automated liquidation

---

## 📞 Deployment Checklist

Before deploying to mainnet:

- [ ] Generate production keypairs
- [ ] Update all `declare_id!()` macros
- [ ] Audit smart contracts
- [ ] Test on devnet extensively
- [ ] Set up multisig admin wallet
- [ ] Implement emergency pause mechanism
- [ ] Configure proper vault authorities
- [ ] Test upgrade authority
- [ ] Document all PDAs and seeds
- [ ] Set up monitoring and alerts

---

## 📚 Resources

- [Anchor Book](https://book.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com/)
- [SPL Token Documentation](https://spl.solana.com/token)
- [Solana Program Library](https://github.com/solana-labs/solana-program-library)

---

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf target/
anchor build
```

### Deployment Fails

```bash
# Check balance
solana balance

# Increase compute budget
solana program deploy --max-len 200000 target/deploy/carbon_credits.so
```

### Program ID Mismatch

Update `declare_id!()` in lib.rs to match deployed program:
```rust
declare_id!("YourActualProgramID111111111111111111111111");
```

---

## ⚡ Quick Commands

```bash
# Build
anchor build

# Test
anchor test

# Deploy devnet
anchor deploy --provider.cluster devnet

# Upgrade program
anchor upgrade target/deploy/carbon_credits.so --program-id <PROGRAM_ID>

# Verify build
anchor verify <PROGRAM_ID>
```

---

**Built with Anchor 0.30.1 for Solana**
