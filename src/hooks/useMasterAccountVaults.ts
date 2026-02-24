'use client'

import { useReadContract, useReadContracts } from 'wagmi'
import { iMasterAccountControllerAbi as coston2Abi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { iMasterAccountControllerAbi as flareAbi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/flare'
import { erc20Abi, erc4626Abi, type Address } from 'viem'
import { getMergedVaults } from '../lib/vaultUtils'
import { useMasterAccountControllerAddress } from './useMasterAccountControllerAddress'
import { useNetworkContext } from '../context/NetworkContext'

const fullVaultAbi = [...erc20Abi, ...erc4626Abi]

export function useMasterAccountVaults() {
  const { masterAccountControllerAddress } = useMasterAccountControllerAddress()
  const { chainId, isTestnet } = useNetworkContext()
  const abi = isTestnet ? coston2Abi : flareAbi

  const { data: vaults, isLoading: isLoadingVaults, error: vaultsError } = useReadContract({
    address: masterAccountControllerAddress,
    abi,
    functionName: 'getVaults',
    chainId,
  })

  const mergedVaults = getMergedVaults(vaults)

  const { data: vaultDetails, isLoading: isLoadingDetails, error: detailsError } = useReadContracts({
    contracts: mergedVaults.flatMap((vault) => [
      {
        address: vault.vaultAddress as Address,
        abi: fullVaultAbi,
        functionName: 'name',
        chainId,
      },
      {
        address: vault.vaultAddress as Address,
        abi: fullVaultAbi,
        functionName: 'symbol',
        chainId,
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
