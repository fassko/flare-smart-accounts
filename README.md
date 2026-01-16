# Smart Accounts

A Next.js application for managing Flare Smart Accounts on the Flare Coston2 testnet using the [Flare Wagmi periphery package](https://www.npmjs.com/package/@flarenetwork/flare-wagmi-periphery-package).

## Features

- **Smart Account Master Controller** - View the master controller contract address
- **Get Personal Account** - Look up personal accounts by XRPL address and view token balances
- **Token Balances** - Display FXRP token balances for personal accounts in a table format
- **Master Account Vaults** - View all vaults associated with the master account
- **Agent Vaults** - Display agent vaults with detailed information
- **XRPL Provider Wallets** - List XRPL provider wallet addresses
- Built with Next.js, Wagmi, Viem, and Tailwind CSS

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

4. Connect your wallet and switch to the desired Flare network (Coston2 recommended for testing)

## Public Deploy

You can access the application on [flare-smart-accounts.vercel.app](https://flare-smart-accounts.vercel.app/).
