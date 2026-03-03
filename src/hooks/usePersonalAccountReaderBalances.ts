'use client'

import { useReadContract } from 'wagmi'
import { type Address } from 'viem'
import { useNetworkContext } from '../context/NetworkContext'

const PERSONAL_ACCOUNT_READER_ADDRESSES = {
  flare: '0x0C6CbAcaf98D7D008619fb1a1479f53ECb4fa44f' as Address,
  coston2: '0x4bE3d7E3D138F8314C2A61a040D0593C10E4186c' as Address,
}

const personalAccountReaderAbi = [
  {
    inputs: [{ internalType: 'address', name: '_personalAccount', type: 'address' }],
    name: 'getBalances',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'natBalance', type: 'uint256' },
          { internalType: 'uint256', name: 'wNatBalance', type: 'uint256' },
          { internalType: 'uint256', name: 'stableCoinBalance', type: 'uint256' },
          { internalType: 'uint256', name: 'fXrpBalance', type: 'uint256' },
          {
            components: [
              { internalType: 'uint256', name: 'vaultId', type: 'uint256' },
              { internalType: 'address', name: 'vaultAddress', type: 'address' },
              { internalType: 'uint8', name: 'vaultType', type: 'uint8' },
              { internalType: 'uint256', name: 'shares', type: 'uint256' },
              { internalType: 'uint256', name: 'assets', type: 'uint256' },
            ],
            internalType: 'struct IPersonalAccountReader.VaultBalance[]',
            name: 'vaults',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct IPersonalAccountReader.AccountBalances',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export type VaultReaderBalance = {
  vaultId: bigint
  vaultAddress: Address
  vaultType: number
  shares: bigint
  assets: bigint
}

export function usePersonalAccountReaderBalances(personalAccountAddress?: string) {
  const { isTestnet, chainId } = useNetworkContext()
  const readerAddress = isTestnet
    ? PERSONAL_ACCOUNT_READER_ADDRESSES.coston2
    : PERSONAL_ACCOUNT_READER_ADDRESSES.flare

  const { data, isLoading, error } = useReadContract({
    address: readerAddress,
    abi: personalAccountReaderAbi,
    functionName: 'getBalances',
    args: personalAccountAddress ? [personalAccountAddress as Address] : undefined,
    chainId,
    query: {
      enabled: !!personalAccountAddress,
    },
  })

  const vaultBalances: VaultReaderBalance[] = (data?.vaults ?? []).map((v) => ({
    vaultId: v.vaultId,
    vaultAddress: v.vaultAddress,
    vaultType: Number(v.vaultType),
    shares: v.shares,
    assets: v.assets,
  }))

  return {
    balances: data,
    vaultBalances,
    isLoading,
    error,
  }
}
