use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer, Burn};

declare_id!("HMm5qCTN1uag7gJACT8zW9wckbJe2iC78RbPqG4FaWxh");

#[program]
pub mod alebrije_coin {
    use super::*;

    /// Initialize the program state for tracking burn configuration
    pub fn initialize(ctx: Context<Initialize>, burn_threshold: u64) -> Result<()> {
        let program_state = &mut ctx.accounts.program_state;
        program_state.burn_threshold = burn_threshold; // 3 billion tokens in raw units
        program_state.authority = ctx.accounts.authority.key();
        program_state.bump = ctx.bumps.program_state;
        Ok(())
    }

    /// Transfer with automatic tax distribution and smart burn mechanism
    pub fn transfer_with_tax(ctx: Context<TransferWithTax>, amount: u64) -> Result<()> {
        let program_state = &ctx.accounts.program_state;
        let mint = &ctx.accounts.mint;
        
        // Get current total supply
        let current_supply = mint.supply;
        msg!("Current supply: {}, Burn threshold: {}", current_supply, program_state.burn_threshold);
        
        // Calculate 5% tax (same total as before)
        let tax_amount = amount.checked_mul(5).unwrap().checked_div(100).unwrap();
        let net_transfer = amount.checked_sub(tax_amount).unwrap();
        
        // Determine burn allocation based on current supply
        let (burn_amount, treasury_amount) = if current_supply > program_state.burn_threshold {
            // Above 3B: burn 1% of transaction, send 4% to treasury
            let burn_amt = amount.checked_mul(1).unwrap().checked_div(100).unwrap();
            let treasury_amt = tax_amount.checked_sub(burn_amt).unwrap();
            (burn_amt, treasury_amt)
        } else {
            // At or below 3B: no burn, send full 5% to treasury
            (0, tax_amount)
        };

        msg!("Tax breakdown - Burn: {}, Treasury: {}, Net transfer: {}", burn_amount, treasury_amount, net_transfer);

        // Execute the main transfer
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.from_token_account.to_account_info(),
                to: ctx.accounts.to_token_account.to_account_info(),
                authority: ctx.accounts.from.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, net_transfer)?;

        // Execute burn if amount > 0 and supply allows
        if burn_amount > 0 {
            let burn_ctx = CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Burn {
                    mint: ctx.accounts.mint.to_account_info(),
                    from: ctx.accounts.from_token_account.to_account_info(),
                    authority: ctx.accounts.from.to_account_info(),
                },
            );
            token::burn(burn_ctx, burn_amount)?;
            msg!("🔥 Burned {} tokens! New supply will be: {}", burn_amount, current_supply.checked_sub(burn_amount).unwrap());
        }

        // Distribute treasury portion to the three wallets (split evenly)
        if treasury_amount > 0 {
            let per_wallet = treasury_amount.checked_div(3).unwrap();
            let remainder = treasury_amount.checked_sub(per_wallet.checked_mul(3).unwrap()).unwrap();

            // Transfer to liquidity wallet
            let liquidity_ctx = CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.from_token_account.to_account_info(),
                    to: ctx.accounts.liquidity_wallet.to_account_info(),
                    authority: ctx.accounts.from.to_account_info(),
                },
            );
            token::transfer(liquidity_ctx, per_wallet)?;

            // Transfer to charity wallet
            let charity_ctx = CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.from_token_account.to_account_info(),
                    to: ctx.accounts.charity_wallet.to_account_info(),
                    authority: ctx.accounts.from.to_account_info(),
                },
            );
            token::transfer(charity_ctx, per_wallet)?;

            // Transfer to marketing wallet (gets remainder too)
            let marketing_ctx = CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.from_token_account.to_account_info(),
                    to: ctx.accounts.marketing_wallet.to_account_info(),
                    authority: ctx.accounts.from.to_account_info(),
                },
            );
            token::transfer(marketing_ctx, per_wallet.checked_add(remainder).unwrap())?;

            msg!("💰 Distributed {} to treasury wallets (liquidity: {}, charity: {}, marketing: {})", 
                treasury_amount, per_wallet, per_wallet, per_wallet.checked_add(remainder).unwrap());
        }

        msg!("✅ Transfer complete - Amount: {}, Tax: {}, Burned: {}, To Treasury: {}", 
            amount, tax_amount, burn_amount, treasury_amount);

        Ok(())
    }

    /// Manual burn function (for testing or admin purposes)
    pub fn burn_tokens(ctx: Context<BurnTokens>, amount: u64) -> Result<()> {
        let burn_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.mint.to_account_info(),
                from: ctx.accounts.from_token_account.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        );
        token::burn(burn_ctx, amount)?;
        
        let current_supply = ctx.accounts.mint.supply;
        msg!("🔥 Manual burn complete! Burned: {}, New supply: {}", amount, current_supply.checked_sub(amount).unwrap());
        
        Ok(())
    }

    /// Update burn threshold (admin only)
    pub fn update_burn_threshold(ctx: Context<UpdateBurnThreshold>, new_threshold: u64) -> Result<()> {
        let program_state = &mut ctx.accounts.program_state;
        let old_threshold = program_state.burn_threshold;
        program_state.burn_threshold = new_threshold;
        
        msg!("🔧 Burn threshold updated from {} to {}", old_threshold, new_threshold);
        Ok(())
    }

    /// Get current program state (for monitoring)
    pub fn get_program_state(ctx: Context<GetProgramState>) -> Result<()> {
        let program_state = &ctx.accounts.program_state;
        let mint = &ctx.accounts.mint;
        
        let current_supply = mint.supply;
        let burn_active = current_supply > program_state.burn_threshold;
        
        msg!("📊 Program State:");
        msg!("  Current Supply: {}", current_supply);
        msg!("  Burn Threshold: {}", program_state.burn_threshold);
        msg!("  Burn Active: {}", burn_active);
        msg!("  Tokens Until Burn Stops: {}", 
            if burn_active { current_supply.checked_sub(program_state.burn_threshold).unwrap() } else { 0 });
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + ProgramState::SPACE,
        seeds = [b"program_state"],
        bump
    )]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferWithTax<'info> {
    #[account(
        seeds = [b"program_state"],
        bump = program_state.bump
    )]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(mut)]
    pub from: Signer<'info>,
    
    #[account(mut)]
    pub from_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub to_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub liquidity_wallet: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub charity_wallet: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub marketing_wallet: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct BurnTokens<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub from_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateBurnThreshold<'info> {
    #[account(
        mut,
        seeds = [b"program_state"],
        bump = program_state.bump,
        has_one = authority
    )]
    pub program_state: Account<'info, ProgramState>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetProgramState<'info> {
    #[account(
        seeds = [b"program_state"],
        bump = program_state.bump
    )]
    pub program_state: Account<'info, ProgramState>,
    
    pub mint: Account<'info, Mint>,
}

#[account]
pub struct ProgramState {
    pub authority: Pubkey,          // 32 bytes
    pub burn_threshold: u64,        // 8 bytes - 3 billion tokens in raw units
    pub bump: u8,                   // 1 byte
}

impl ProgramState {
    pub const SPACE: usize = 32 + 8 + 1;
}

#[error_code]
pub enum ErrorCode {
    #[msg("Wallet exceeds the 2% max wallet limit.")]
    MaxWalletExceeded,
    
    #[msg("Unauthorized access. Only the program authority can perform this action.")]
    Unauthorized,
    
    #[msg("Invalid burn threshold. Must be greater than 0.")]
    InvalidBurnThreshold,
} 