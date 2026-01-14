'use client'

import { useReadIAssetManager, useReadIAgentOwnerRegistry } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { useAssetManagerAddress } from './useAssetManagerAddress'

export function useAgentName(ownerManagementAddress?: string) {
  // Get the AssetManager address from shared hook
  const { assetManagerAddress } = useAssetManagerAddress()

  // Get settings from AssetManager to extract agentOwnerRegistry address
  const { data: settings } = useReadIAssetManager({
    address: assetManagerAddress,
    functionName: 'getSettings',
    query: {
      enabled: !!assetManagerAddress,
    },
  })

  // Extract agentOwnerRegistry from settings
  const agentOwnerRegistryAddress = settings && typeof settings === 'object' && settings !== null && !Array.isArray(settings)
    ? (settings as unknown as Record<string, unknown>).agentOwnerRegistry as `0x${string}` | undefined
    : undefined

  // Get agent name from Agent Owner Registry
  const { data: agentName, isLoading, error } = useReadIAgentOwnerRegistry({
    address: agentOwnerRegistryAddress,
    functionName: 'getAgentName',
    args: ownerManagementAddress ? [ownerManagementAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!agentOwnerRegistryAddress && !!ownerManagementAddress,
    },
  })

  return {
    agentName,
    assetManagerAddress,
    isLoading,
    error,
  }
}
