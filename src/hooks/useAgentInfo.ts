'use client'

import { useReadContract } from 'wagmi'
import { iAssetManagerAbi as coston2Abi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { iAssetManagerAbi as flareAbi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/flare'
import { useAssetManagerAddress } from './useAssetManagerAddress'
import { useNetworkContext } from '../context/NetworkContext'

export function useAgentInfo(agentVaultAddress?: string) {
  // Get the AssetManager address from shared hook
  const { assetManagerAddress, isLoading: isLoadingAddress, error: addressError } = useAssetManagerAddress()
  const { chainId, isTestnet } = useNetworkContext()
  const abi = isTestnet ? coston2Abi : flareAbi

  // Then, get the agent info from the AssetManager
  const { data: agentInfo, isLoading: isLoadingInfo, error: infoError } = useReadContract({
    address: assetManagerAddress,
    abi,
    functionName: 'getAgentInfo',
    args: agentVaultAddress ? [agentVaultAddress as `0x${string}`] : undefined,
    chainId,
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
