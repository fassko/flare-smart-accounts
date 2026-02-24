'use client'

import { useReadIMasterAccountController } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { useReadContracts } from 'wagmi'
import { erc20Abi, erc4626Abi, type Address } from 'viem'
import { getMergedVaults } from '../lib/vaultUtils'
import { useMasterAccountControllerAddress } from './useMasterAccountControllerAddress'

const fullVaultAbi = [...erc20Abi, ...erc4626Abi]

export function useMasterAccountVaults() {
  const { masterAccountControllerAddress } = useMasterAccountControllerAddress()

  const { data: vaults, isLoading: isLoadingVaults, error: vaultsError } = useReadIMasterAccountController({
    address: masterAccountControllerAddress,
    functionName: 'getVaults',
  })

  const mergedVaults = getMergedVaults(vaults)

  const { data: vaultDetails, isLoading: isLoadingDetails, error: detailsError } = useReadContracts({
    contracts: mergedVaults.flatMap((vault) => [
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
    ]),
    query: {
      enabled: mergedVaults.length > 0,
    },
  })

  const vaultsWithDetails = mergedVaults.map((vault, index) => {
    const nameResult = vaultDetails?.[index * 2]
    const symbolResult = vaultDetails?.[index * 2 + 1]

    return {
      ...vault,
      name: nameResult?.status === 'success' ? (nameResult.result as string) : undefined,
      symbol: symbolResult?.status === 'success' ? (symbolResult.result as string) : undefined,
    }
  })

  return {
    vaults: vaultsWithDetails,
    isLoading: isLoadingVaults || isLoadingDetails,
    error: vaultsError || detailsError,
  }
}
