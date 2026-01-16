'use client'

import { useReadIAssetManager } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { useAssetManagerAddress } from './useAssetManagerAddress'

/**
 * Hook to get the FXRP token address from AssetManager
 */
export function useFxrpTokenAddress() {
  const { assetManagerAddress, isLoading: isLoadingAddress, error: addressError } = useAssetManagerAddress()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - Type instantiation is excessively deep with generated wagmi types
  const { data: fxrpAddress, isLoading: isLoadingFxrp, error: fxrpError } = useReadIAssetManager({
    address: assetManagerAddress,
    functionName: 'fAsset',
    query: {
      enabled: !!assetManagerAddress,
    },
  })

  return {
    fxrpAddress: fxrpAddress as `0x${string}` | undefined,
    isLoading: isLoadingAddress || isLoadingFxrp,
    error: addressError || fxrpError,
  }
}
