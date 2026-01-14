# Smart Accounts

A Next.js application for making [Fassets](https://dev.flare.network/fassets/overview) FXRP payments on the Flare Coston2 testnet using the [Flare Wagmi periphery package](https://www.npmjs.com/package/@flarenetwork/flare-wagmi-periphery-package).

## Features

- Connect wallet using Web3 wallets (MetaMask, etc.)
- View FXRP balance
- Send FXRP tokens to any address
- Real-time transaction status
- Built with Next.js, Wagmi, and Tailwind CSS

## Dynamic FXRP Address Resolution

The app dynamically fetches the FXRP contract address using:
1. **FlareContractsRegistry** → `getContractAddressByName('AssetManagerFXRP')`
2. **AssetManagerFXRP** → `fAsset()` function

This ensures the correct FXRP address is always used, even if it changes.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser

4. Connect your wallet and switch to the Coston2 network

## Technical Implementation

- **Contract ABIs**: Flare contracts use minimal required function signatures  
- **Dynamic Address**: FXRP address fetched via FlareContractsRegistry
- **Type Safety**: Full TypeScript implementation

## Network Configuration

The app is configured for Flare Testnet (Coston2) using the official wagmi chain:
- Chain ID: 114
- Name: Flare Testnet
- Uses official `flareTestnet` from `@wagmi/chains`

# Public Deploy

You can access it on [smart-accounts.vercel.app](https://smart-accounts.vercel.app/).