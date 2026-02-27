'use client'

import { useReadContracts } from 'wagmi'
import { erc20Abi, erc4626Abi, type Address } from 'viem'
import { useMasterAccountVaults } from './useMasterAccountVaults'
import { useNetworkContext } from '../context/NetworkContext'

const fullVaultAbi = [...erc20Abi, ...erc4626Abi]

const lpTokenAddressAbi = [
  {
    name: 'lpTokenAddress',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
] as const

const UPSHIFT_VAULT_TYPE = 2

export function useVaultDetails(personalAccountAddress?: string) {
  const { vaults, isLoading: isLoadingVaults, error: vaultsError } = useMasterAccountVaults()
  const { chainId } = useNetworkContext()

  const upshiftVaults = vaults.filter((v) => Number(v.vaultType) === UPSHIFT_VAULT_TYPE)

  const { data: lpTokenAddresses, isLoading: isLoadingLpTokens } = useReadContracts({
    contracts: upshiftVaults.map((vault) => ({
      address: vault.vaultAddress as Address,
      abi: lpTokenAddressAbi,
      functionName: 'lpTokenAddress' as const,
      chainId,
    })),
    query: {
      enabled: upshiftVaults.length > 0,
    },
  })

  // Build a map from vaultAddress -> lpTokenAddress for Upshift vaults
  const lpTokenMap = new Map<string, Address>()
  upshiftVaults.forEach((vault, i) => {
    const result = lpTokenAddresses?.[i]
    if (result?.status === 'success' && result.result) {
      lpTokenMap.set((vault.vaultAddress as string).toLowerCase(), result.result as Address)
    }
  })

  const { data: vaultDetails, isLoading: isLoadingDetails, error: detailsError } = useReadContracts({
    contracts: vaults.flatMap((vault) => {
      const isUpshift = Number(vault.vaultType) === UPSHIFT_VAULT_TYPE
      const lpToken = lpTokenMap.get((vault.vaultAddress as string).toLowerCase())
      const tokenAddress = (isUpshift && lpToken) ? lpToken : vault.vaultAddress as Address

      return [
        {
          address: tokenAddress,
          abi: fullVaultAbi,
          functionName: 'name' as const,
          chainId,
        },
        {
          address: tokenAddress,
          abi: fullVaultAbi,
          functionName: 'symbol' as const,
          chainId,
        },
        {
          address: tokenAddress,
          abi: fullVaultAbi,
          functionName: 'decimals' as const,
          chainId,
        },
        {
          address: vault.vaultAddress as Address,
          abi: fullVaultAbi,
          functionName: 'balanceOf' as const,
          args: [personalAccountAddress as Address],
          chainId,
        },
      ]
    }),
    query: {
      enabled: vaults.length > 0 && !!personalAccountAddress && !isLoadingLpTokens,
    },
  })

  const vaultsWithDetails = vaults.map((vault, index) => {
    const nameResult = vaultDetails?.[index * 4]
    const symbolResult = vaultDetails?.[index * 4 + 1]
    const decimalsResult = vaultDetails?.[index * 4 + 2]
    const balanceResult = vaultDetails?.[index * 4 + 3]

    return {
      ...vault,
      name: nameResult?.status === 'success' ? (nameResult.result as string) : undefined,
      symbol: symbolResult?.status === 'success' ? (symbolResult.result as string) : undefined,
      decimals: decimalsResult?.status === 'success' ? Number(decimalsResult.result) : undefined,
      balance: balanceResult?.status === 'success' ? (balanceResult.result as bigint) : undefined,
    }
  })

  return {
    vaultsWithDetails,
    isLoading: isLoadingVaults || isLoadingLpTokens || isLoadingDetails,
    error: vaultsError || detailsError,
  }
}
