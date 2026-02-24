import { flare, flareTestnet } from '@wagmi/chains'

const XRPL_TESTNET_EXPLORER_URL = 'https://testnet.xrpl.org'
const XRPL_MAINNET_EXPLORER_URL = 'https://livenet.xrpl.org'

/**
 * Check if an address is an XRPL address (starts with 'r' and is base58 encoded)
 */
export function isXrplAddress(address: string): boolean {
  return /^r[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address)
}

/**
 * Get the XRPL explorer URL for an address (testnet or mainnet)
 */
export function getXrplExplorerAddressUrl(address: string, isTestnet = true): string {
  const baseUrl = isTestnet ? XRPL_TESTNET_EXPLORER_URL : XRPL_MAINNET_EXPLORER_URL
  return `${baseUrl}/accounts/${address}`
}

/**
 * Get the Flare explorer URL for an address
 */
export function getExplorerAddressUrl(address: string, isTestnet = true): string {
  const chain = isTestnet ? flareTestnet : flare
  return `${chain.blockExplorers!.default.url}/address/${address}`
}

/**
 * Get the Flare explorer URL for a transaction hash
 */
export function getExplorerTransactionUrl(hash: string, isTestnet = true): string {
  const chain = isTestnet ? flareTestnet : flare
  return `${chain.blockExplorers!.default.url}/tx/${hash}`
}

/**
 * Format an address or hash to a shortened version (e.g., 0x1234...5678)
 */
export function formatAddress(address: string, startLength: number = 6, endLength: number = 4): string {
  if (!address || address.length <= startLength + endLength) {
    return address
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

/**
 * Serialize an object to JSON, converting BigInt values to strings
 */
export function serializeWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString()
    }
    return value
  }, 2)
}
