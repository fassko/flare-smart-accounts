'use client'

import { useReadContract, useReadContracts } from 'wagmi'
import { iMasterAccountControllerAbi as coston2Abi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { iMasterAccountControllerAbi as flareAbi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/flare'
import { erc20Abi, erc4626Abi, type Address } from 'viem'
import { getMergedVaults } from '../lib/vaultUtils'
import { useMasterAccountControllerAddress } from './useMasterAccountControllerAddress'
import { useNetworkContext } from '../context/NetworkContext'

const fullVaultAbi = [...erc20Abi, ...erc4626Abi]

const lpTokenAddressAbi = [
  {
    name: 'lpTokenAddress',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
] as const

const UPSHIFT_VAULT_TYPE = 2

export function useMasterAccountVaults() {
  const { masterAccountControllerAddress } = useMasterAccountControllerAddress()
  const { chainId, isTestnet } = useNetworkContext()
  const abi = isTestnet ? coston2Abi : flareAbi

  const { data: vaults, isLoading: isLoadingVaults, error: vaultsError } = useReadContract({
    address: masterAccountControllerAddress,
    abi,
    functionName: 'getVaults',
    chainId,
  })

  const mergedVaults = getMergedVaults(vaults)

  const upshiftVaults = mergedVaults.filter((v) => Number(v.vaultType) === UPSHIFT_VAULT_TYPE)

  const { data: lpTokenAddresses, isLoading: isLoadingLpTokens } = useReadContracts({
    contracts: upshiftVaults.map((vault) => ({
      address: vault.vaultAddress as Address,
      abi: lpTokenAddressAbi,
      functionName: 'lpTokenAddress' as const,
      chainId,
    })),
    query: {
      enabled: upshiftVaults.length > 0,
    },
  })

  // Build a map from vaultAddress -> lpTokenAddress for Upshift vaults
  const lpTokenMap = new Map<string, Address>()
  upshiftVaults.forEach((vault, i) => {
    const result = lpTokenAddresses?.[i]
    if (result?.status === 'success' && result.result) {
      lpTokenMap.set((vault.vaultAddress as string).toLowerCase(), result.result as Address)
    }
  })

  const { data: vaultDetails, isLoading: isLoadingDetails, error: detailsError } = useReadContracts({
    contracts: mergedVaults.flatMap((vault) => {
      const isUpshift = Number(vault.vaultType) === UPSHIFT_VAULT_TYPE
      const lpToken = lpTokenMap.get((vault.vaultAddress as string).toLowerCase())
      const tokenAddress = (isUpshift && lpToken) ? lpToken : vault.vaultAddress as Address

      return [
        {
          address: tokenAddress,
          abi: fullVaultAbi,
          functionName: 'name' as const,
          chainId,
        },
        {
          address: tokenAddress,
          abi: fullVaultAbi,
          functionName: 'symbol' as const,
          chainId,
        },
        {
          address: tokenAddress,
          abi: fullVaultAbi,
          functionName: 'decimals' as const,
          chainId,
        },
        {
          address: tokenAddress,
          abi: fullVaultAbi,
          functionName: 'totalSupply' as const,
          chainId,
        },
      ]
    }),
    query: {
      enabled: mergedVaults.length > 0 && !isLoadingLpTokens,
    },
  })

  const vaultsWithDetails = mergedVaults.map((vault, index) => {
    const nameResult = vaultDetails?.[index * 4]
    const symbolResult = vaultDetails?.[index * 4 + 1]
    const decimalsResult = vaultDetails?.[index * 4 + 2]
    const totalSupplyResult = vaultDetails?.[index * 4 + 3]
    const lpTokenAddress = lpTokenMap.get((vault.vaultAddress as string).toLowerCase())
    const isUpshift = Number(vault.vaultType) === UPSHIFT_VAULT_TYPE
    const tokenAddress = (isUpshift && lpTokenAddress) ? lpTokenAddress : vault.vaultAddress as Address

    return {
      ...vault,
      name: nameResult?.status === 'success' ? (nameResult.result as string) : undefined,
      symbol: symbolResult?.status === 'success' ? (symbolResult.result as string) : undefined,
      decimals: decimalsResult?.status === 'success' ? Number(decimalsResult.result) : undefined,
      totalSupply: totalSupplyResult?.status === 'success' ? (totalSupplyResult.result as bigint) : undefined,
      lpTokenAddress,
      tokenAddress,
    }
  })

  return {
    vaults: vaultsWithDetails,
    isLoading: isLoadingVaults || isLoadingLpTokens || isLoadingDetails,
    error: vaultsError || detailsError,
  }
}
