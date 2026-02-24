'use client'

import { useReadContract } from 'wagmi'
import { iAssetManagerAbi as coston2AssetManagerAbi, iAgentOwnerRegistryAbi as coston2AgentOwnerAbi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { iAssetManagerAbi as flareAssetManagerAbi, iAgentOwnerRegistryAbi as flareAgentOwnerAbi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/flare'
import { useAssetManagerAddress } from './useAssetManagerAddress'
import { useNetworkContext } from '../context/NetworkContext'

export function useAgentName(ownerManagementAddress?: string) {
  // Get the AssetManager address from shared hook
  const { assetManagerAddress } = useAssetManagerAddress()
  const { chainId, isTestnet } = useNetworkContext()
  const assetManagerAbi = isTestnet ? coston2AssetManagerAbi : flareAssetManagerAbi
  const agentOwnerAbi = isTestnet ? coston2AgentOwnerAbi : flareAgentOwnerAbi

  // Get settings from AssetManager to extract agentOwnerRegistry address
  const { data: settings } = useReadContract({
    address: assetManagerAddress,
    abi: assetManagerAbi,
    functionName: 'getSettings',
    chainId,
    query: {
      enabled: !!assetManagerAddress,
    },
  })

  // Extract agentOwnerRegistry from settings
  const agentOwnerRegistryAddress = settings && typeof settings === 'object' && settings !== null && !Array.isArray(settings)
    ? (settings as unknown as Record<string, unknown>).agentOwnerRegistry as `0x${string}` | undefined
    : undefined

  // Get agent name from Agent Owner Registry
  const { data: agentName, isLoading, error } = useReadContract({
    address: agentOwnerRegistryAddress,
    abi: agentOwnerAbi,
    functionName: 'getAgentName',
    args: ownerManagementAddress ? [ownerManagementAddress as `0x${string}`] : undefined,
    chainId,
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
