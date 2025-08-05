# Wallet Integration & Contract Setup Guide

## Overview
This project now includes Reown AppKit for wallet connection and integration with the ZUG Presale smart contract.

## Setup Instructions

### 1. Get Reown AppKit Project ID
1. Visit [Reown Dashboard](https://dashboard.reown.com)
2. Create a new project
3. Copy your project ID

### 2. Environment Configuration
Create a `.env.local` file in the root directory with:

```env
# Reown AppKit Project ID
NEXT_PUBLIC_PROJECT_ID=your_project_id_here

# ZUG Presale Contract Address
NEXT_PUBLIC_ZUG_PRESALE_ADDRESS=0x...
```

### 3. Contract Address
Replace `0x...` with your actual deployed ZUG Presale contract address.

### 4. Features Implemented

#### Wallet Connection
- ✅ Real wallet connection using Reown AppKit
- ✅ Support for multiple wallets (MetaMask, WalletConnect, Coinbase, etc.)
- ✅ Connection status display
- ✅ Disconnect functionality

#### Contract Integration
- ✅ ZUG Presale contract integration
- ✅ Real-time price display
- ✅ Available token balance
- ✅ Contract ETH balance
- ✅ Wallet connection status in FeaturesCard

#### Components Updated
- `src/components/Header.tsx` - Now uses real wallet connection
- `src/components/FeaturesCard.tsx` - Displays contract data
- `src/components/WalletConnectButton.tsx` - New wallet connection component

### 5. Configuration Files
- `config/index.ts` - Reown AppKit configuration
- `context/index.tsx` - AppKit context provider
- `src/app/layout.tsx` - Updated with context provider
- `next.config.ts` - Webpack configuration for AppKit

### 6. Dependencies Added
- `@reown/appkit` - Main AppKit library
- `@reown/appkit-adapter-wagmi` - Wagmi adapter
- `wagmi` - Web3 React hooks
- `viem` - Ethereum library
- `@tanstack/react-query` - Query client

### 7. Usage

#### Wallet Connection
The wallet connection button is now available in:
- Header (desktop and mobile)
- FeaturesCard (when wallet not connected)

#### Contract Data Display
The FeaturesCard now shows:
- Current token price in USD
- Available tokens in contract
- Contract ETH balance
- Wallet connection status

### 8. Next Steps
1. Deploy your ZUG Presale contract
2. Update the contract address in `.env.local`
3. Get your Reown project ID and update `.env.local`
4. Test the wallet connection and contract integration

### 9. Troubleshooting

#### Common Issues
1. **Project ID not defined**: Make sure `NEXT_PUBLIC_PROJECT_ID` is set in `.env.local`
2. **Contract address error**: Ensure the contract address is correct and the contract is deployed
3. **Wallet connection issues**: Check that the project ID is valid and the domain is whitelisted

#### Development
- Run `npm run dev` to start the development server
- The wallet connection will work on `localhost` with the default project ID
- For production, use a proper project ID from Reown Dashboard

### 10. Security Notes
- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Validate contract addresses before use
- Test thoroughly on testnet before mainnet deployment 