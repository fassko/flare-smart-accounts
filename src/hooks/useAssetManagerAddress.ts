'use client'

import { useReadIFlareContractRegistry } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { FLARE_CONTRACT_REGISTRY_ADDRESS } from '../lib/constants'

export function useAssetManagerAddress() {
  const { data: assetManagerAddress, isLoading, error } = useReadIFlareContractRegistry({
    address: FLARE_CONTRACT_REGISTRY_ADDRESS,
    functionName: 'getContractAddressByName',
    args: ['AssetManagerFXRP'],
  })

  return {
    assetManagerAddress: assetManagerAddress as `0x${string}` | undefined,
    isLoading,
    error,
  }
}
