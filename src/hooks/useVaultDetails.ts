'use client'

import { useReadContracts } from 'wagmi'
import { erc20Abi, erc4626Abi, type Address } from 'viem'
import { useMasterAccountVaults } from './useMasterAccountVaults'

const fullVaultAbi = [...erc20Abi, ...erc4626Abi]

export function useVaultDetails(personalAccountAddress?: string) {
  const { vaults, isLoading: isLoadingVaults, error: vaultsError } = useMasterAccountVaults()

  const { data: vaultDetails, isLoading: isLoadingDetails, error: detailsError } = useReadContracts({
    contracts: vaults.flatMap((vault) => [
      {
        address: vault.vaultAddress as Address,
        abi: fullVaultAbi,
        functionName: 'name',
      },
      {
        address: vault.vaultAddress as Address,
        abi: fullVaultAbi,
        functionName: 'symbol',
      },
      {
        address: vault.vaultAddress as Address,
        abi: fullVaultAbi,
        functionName: 'decimals',
      },
      {
        address: vault.vaultAddress as Address,
        abi: fullVaultAbi,
        functionName: 'balanceOf',
        args: [personalAccountAddress as Address],
      },
    ]),
    query: {
      enabled: vaults.length > 0 && !!personalAccountAddress,
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
    isLoading: isLoadingVaults || isLoadingDetails,
    error: vaultsError || detailsError,
  }
}
