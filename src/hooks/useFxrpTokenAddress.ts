'use client'

import { useReadContract } from 'wagmi'
import { iAssetManagerAbi as coston2Abi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { iAssetManagerAbi as flareAbi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/flare'
import { useAssetManagerAddress } from './useAssetManagerAddress'
import { useNetworkContext } from '../context/NetworkContext'

/**
 * Hook to get the FXRP token address from AssetManager
 */
export function useFxrpTokenAddress() {
  const { assetManagerAddress, isLoading: isLoadingAddress, error: addressError } = useAssetManagerAddress()
  const { chainId, isTestnet } = useNetworkContext()
  const abi = isTestnet ? coston2Abi : flareAbi

  const { data: fxrpAddress, isLoading: isLoadingFxrp, error: fxrpError } = useReadContract({
    address: assetManagerAddress,
    abi,
    functionName: 'fAsset',
    chainId,
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
