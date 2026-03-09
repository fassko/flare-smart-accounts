'use client'

import { useReadContract } from 'wagmi'
import type { Address } from 'viem'
import { iPersonalAccountAbi as coston2Abi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { iPersonalAccountAbi as flareAbi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/flare'
import { useNetworkContext } from '../context/NetworkContext'
import { isXrplAddress } from '../lib/utils'

/**
 * Fetches the XRPL owner for a Flare address (personal account).
 * If it returns an XRPL account address, the Flare address is a smart account.
 */
export function useXrplOwner(flareAddress?: string) {
  const { chainId, isTestnet } = useNetworkContext()
  const abi = isTestnet ? coston2Abi : flareAbi

  const { data: xrplOwner, isLoading, error } = useReadContract({
    address: flareAddress as Address | undefined,
    abi,
    functionName: 'xrplOwner',
    args: [],
    chainId,
    query: {
      enabled: !!flareAddress && flareAddress.startsWith('0x') && flareAddress.length === 42,
    },
  })

  const xrplOwnerStr = typeof xrplOwner === 'string' ? xrplOwner : undefined
  const isSmartAccount = !!xrplOwnerStr && isXrplAddress(xrplOwnerStr)

  return {
    xrplOwner: xrplOwnerStr,
    isSmartAccount,
    isLoading,
    error,
  }
}
