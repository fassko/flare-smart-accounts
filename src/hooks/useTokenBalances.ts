'use client'

import { useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'

/**
 * Hook to get ERC20 token balance for an address
 */
export function useERC20Balance(tokenAddress: string, accountAddress?: string) {
  const { data: balance, isLoading, error } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: accountAddress ? [accountAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!accountAddress && !!tokenAddress && accountAddress.startsWith('0x') && accountAddress.length === 42,
    },
  })

  const { data: decimals } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'decimals',
    query: {
      enabled: !!tokenAddress,
    },
  })

  const { data: symbol } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'symbol',
    query: {
      enabled: !!tokenAddress,
    },
  })

  const { data: name } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'name',
    query: {
      enabled: !!tokenAddress,
    },
  })

  const formattedBalance = balance && decimals 
    ? (Number(balance) / Math.pow(10, Number(decimals))).toLocaleString('en-US', {
        maximumFractionDigits: 6,
      })
    : undefined

  return {
    balance,
    formattedBalance,
    symbol: symbol as string | undefined,
    name: name as string | undefined,
    decimals: decimals ? Number(decimals) : undefined,
    isLoading: isLoading || !decimals || !symbol || !name,
    error,
  }
}
