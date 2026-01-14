'use client'

import { useReadIAssetManager } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { useAssetManagerAddress } from './useAssetManagerAddress'

export function useAgentInfo(agentVaultAddress?: string) {
  // Get the AssetManager address from shared hook
  const { assetManagerAddress, isLoading: isLoadingAddress, error: addressError } = useAssetManagerAddress()

  // Then, get the agent info from the AssetManager
  // @ts-expect-error - Type instantiation issue with generated wagmi types
  const { data: agentInfo, isLoading: isLoadingInfo, error: infoError } = useReadIAssetManager({
    address: assetManagerAddress,
    functionName: 'getAgentInfo',
    args: agentVaultAddress ? [agentVaultAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!assetManagerAddress && !!agentVaultAddress,
    },
  })

  return {
    agentInfo,
    assetManagerAddress,
    isLoading: isLoadingAddress || isLoadingInfo,
    error: addressError || infoError,
  }
}
