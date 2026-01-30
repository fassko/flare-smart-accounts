'use client'

import { useReadIMasterAccountController } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { useReadContracts } from 'wagmi'
import { erc20Abi, type Address } from 'viem'
import { MASTER_ACCOUNT_CONTROLLER_ADDRESS } from '../lib/constants'
import { getMergedVaults } from '../lib/vaultUtils'

export function useMasterAccountVaults() {
  const { data: vaults, isLoading: isLoadingVaults, error: vaultsError } = useReadIMasterAccountController({
    address: MASTER_ACCOUNT_CONTROLLER_ADDRESS,
    functionName: 'getVaults',
  })

  const mergedVaults = getMergedVaults(vaults)

  const { data: vaultDetails, isLoading: isLoadingDetails, error: detailsError } = useReadContracts({
    contracts: mergedVaults.flatMap((vault) => [
      {
        address: vault.vaultAddress as Address,
        abi: erc20Abi,
        functionName: 'name',
      },
      {
        address: vault.vaultAddress as Address,
        abi: erc20Abi,
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
