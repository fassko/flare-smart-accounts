import type { Address } from 'viem';

export const MASTER_ACCOUNT_CONTROLLER_ADDRESS = '0x434936d47503353f06750Db1A444DBDC5F0AD37c' as Address;
export const FLARE_CONTRACT_REGISTRY_ADDRESS = '0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019' as Address;

// XRP Ledger protocol constant: 1 XRP = 1,000,000 drops
export const DROPS_PER_XRP = BigInt(1_000_000);

export const VAULT_TYPES = {
  1: 'Firelight',
  2: 'Upshift',
} as const;

export const VAULT_TYPE_BADGE_CLASSES = {
  1: 'bg-orange-100 text-orange-800',
  2: 'bg-green-100 text-green-800',
} as const;
