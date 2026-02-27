'use client'

import { useReadContract } from 'wagmi'
import { type Abi } from 'viem'
import { testFtsoV2InterfaceAbi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { ftsoV2InterfaceAbi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/flare'
import { iFlareContractRegistryAbi as coston2RegistryAbi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { iFlareContractRegistryAbi as flareRegistryAbi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/flare'
import { FLARE_CONTRACT_REGISTRY_ADDRESS } from '../lib/constants'
import { useNetworkContext } from '../context/NetworkContext'

// XRP/USD feed ID (bytes21) — from FTSO feed list
const XRP_USD_FEED_ID = '0x015852502f55534400000000000000000000000000' as const

// getFeedById is payable in ftsoV2InterfaceAbi so wagmi's useReadContract won't
// accept it via the strict types. Cast to generic Abi — eth_call works fine
// without msg.value regardless of the on-chain stateMutability declaration.
const flareAbi = ftsoV2InterfaceAbi as Abi

export function useXrpPrice() {
  const { chainId, isTestnet } = useNetworkContext()
  const registryAbi = isTestnet ? coston2RegistryAbi : flareRegistryAbi

  // Resolve FtsoV2 address dynamically via ContractRegistry
  const { data: ftsoV2Address } = useReadContract({
    address: FLARE_CONTRACT_REGISTRY_ADDRESS,
    abi: registryAbi,
    functionName: 'getContractAddressByName',
    args: ['FtsoV2'],
    chainId,
  })

  // Coston2: use TestFtsoV2Interface (all methods are view, no fees)
  const { data: coston2Data, isLoading: isLoadingCoston2 } = useReadContract({
    address: ftsoV2Address as `0x${string}` | undefined,
    abi: testFtsoV2InterfaceAbi,
    functionName: 'getFeedById',
    args: [XRP_USD_FEED_ID],
    chainId,
    query: {
      enabled: isTestnet && !!ftsoV2Address,
      refetchInterval: 2000,
    },
  })

  // Flare mainnet: ftsoV2InterfaceAbi cast to generic Abi so useReadContract accepts it
  const { data: flareData, isLoading: isLoadingFlare } = useReadContract({
    address: ftsoV2Address as `0x${string}` | undefined,
    abi: flareAbi,
    functionName: 'getFeedById',
    args: [XRP_USD_FEED_ID],
    chainId,
    query: {
      enabled: !isTestnet && !!ftsoV2Address,
      refetchInterval: 2000,
    },
  })

  const raw = isTestnet ? coston2Data : flareData as [bigint, number, bigint] | undefined
  const value = raw?.[0]
  const decimals = raw?.[1]

  const price =
    value !== undefined && decimals !== undefined
      ? Number(value) / 10 ** Number(decimals)
      : undefined

  return { price, isLoading: isTestnet ? isLoadingCoston2 : isLoadingFlare }
}
