'use client'

import { useReadContract } from 'wagmi'
import { iFlareContractRegistryAbi as coston2Abi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { iFlareContractRegistryAbi as flareAbi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/flare'
import { FLARE_CONTRACT_REGISTRY_ADDRESS } from '../lib/constants'
import { useNetworkContext } from '../context/NetworkContext'

export function useAssetManagerAddress() {
  const { chainId, isTestnet } = useNetworkContext()
  const abi = isTestnet ? coston2Abi : flareAbi

  const { data: assetManagerAddress, isLoading, error } = useReadContract({
    address: FLARE_CONTRACT_REGISTRY_ADDRESS,
    abi,
    functionName: 'getContractAddressByName',
    args: ['AssetManagerFXRP'],
    chainId,
  })

  return {
    assetManagerAddress: assetManagerAddress as `0x${string}` | undefined,
    isLoading,
    error,
  }
}
