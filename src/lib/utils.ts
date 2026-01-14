export const COSTON2_EXPLORER_URL = 'https://coston2-explorer.flare.network'
export const XRPL_TESTNET_EXPLORER_URL = 'https://testnet.xrpl.org'

/**
 * Check if an address is an XRPL address (starts with 'r' and is base58 encoded)
 */
export function isXrplAddress(address: string): boolean {
  return /^r[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address)
}

/**
 * Get the XRPL testnet explorer URL for an address
 */
export function getXrplExplorerAddressUrl(address: string): string {
  return `${XRPL_TESTNET_EXPLORER_URL}/accounts/${address}`
}

/**
 * Get the Flare Coston2 explorer URL for an address
 */
export function getExplorerAddressUrl(address: string): string {
  return `${COSTON2_EXPLORER_URL}/address/${address}`
}

/**
 * Get the Flare Coston2 explorer URL for a transaction hash
 */
export function getExplorerTransactionUrl(hash: string): string {
  return `${COSTON2_EXPLORER_URL}/tx/${hash}`
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
