'use client'

import { useReadContracts } from 'wagmi'
import { erc20Abi, type Address } from 'viem'
import { useERC20Balance } from '../hooks/useTokenBalances'
import { useFxrpTokenAddress } from '../hooks/useFxrpTokenAddress'
import { useXrpPrice } from '../hooks/useXrpPrice'
import { getExplorerAddressUrl, formatAddress } from '../lib/utils'
import { useNetworkContext } from '../context/NetworkContext'
import type { VaultReaderBalance } from '../hooks/usePersonalAccountReaderBalances'

type VaultItem = { tokenAddress: string; vaultId: bigint; vaultType: number }

function useVaultTokenBalances(vaultItems: VaultItem[], accountAddress: string) {
  const { chainId } = useNetworkContext()

  const { data, isLoading } = useReadContracts({
    contracts: vaultItems.map(({ tokenAddress }) => ({
      address: tokenAddress as Address,
      abi: erc20Abi,
      functionName: 'balanceOf' as const,
      args: [accountAddress as Address],
      chainId,
    })),
    query: {
      enabled: vaultItems.length > 0 && !!accountAddress,
    },
  })

  const hasAnyBalance = data?.some(
    (result) => result.status === 'success' && (result.result as bigint) > BigInt(0)
  ) ?? false

  return { hasAnyBalance, isLoading }
}

function FxrpTokenRow({ tokenAddress, accountAddress }: { tokenAddress: string; accountAddress: string }) {
  const tokenData = useERC20Balance(tokenAddress, accountAddress)
  const { isTestnet } = useNetworkContext()

  if (!tokenData.balance || tokenData.balance === BigInt(0)) return null

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-700 font-medium">
        {tokenData.symbol || tokenData.name || formatAddress(tokenAddress)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        <a
          href={getExplorerAddressUrl(tokenAddress, isTestnet)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E6007A] hover:text-[#C40066] underline font-mono"
        >
          {formatAddress(tokenAddress)}
        </a>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 font-mono">
        {tokenData.formattedBalance || '0'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 font-mono">
        {tokenData.assetName || ''}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 font-mono">
        {tokenData.assetSymbol || ''}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 font-mono">
        <a
          href={getExplorerAddressUrl(tokenData.assetManager, isTestnet)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E6007A] hover:text-[#C40066] underline font-mono"
        >
          {formatAddress(tokenData.assetManager)}
        </a>
      </td>
    </tr>
  )
}

function formatTokenAmount(value: bigint, decimals = 18): string {
  return (Number(value) / Math.pow(10, decimals)).toLocaleString('en-US', {
    maximumFractionDigits: 6,
  })
}

function VaultTokenRow({
  tokenAddress,
  accountAddress,
  xrpPrice,
  readerBalance,
}: {
  tokenAddress: string
  accountAddress: string
  xrpPrice: number | undefined
  readerBalance: VaultReaderBalance | undefined
}) {
  const tokenData = useERC20Balance(tokenAddress, accountAddress)
  const { isTestnet } = useNetworkContext()

  const hasErc20Balance = tokenData.balance && tokenData.balance > BigInt(0)
  const hasReaderBalance = readerBalance && (readerBalance.shares > BigInt(0) || readerBalance.assets > BigInt(0))

  if (!hasErc20Balance && !hasReaderBalance) return null

  const balanceNum = tokenData.decimals !== undefined
    ? Number(tokenData.balance) / Math.pow(10, tokenData.decimals)
    : undefined

  const usdValue = balanceNum !== undefined && xrpPrice !== undefined
    ? '$' + (balanceNum * xrpPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '-'

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-700 font-medium">
        {tokenData.name || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 font-medium">
        {tokenData.symbol || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        <a
          href={getExplorerAddressUrl(tokenAddress, isTestnet)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E6007A] hover:text-[#C40066] underline font-mono"
        >
          {formatAddress(tokenAddress)}
        </a>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 font-mono">
        {tokenData.formattedBalance || '0'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 font-mono">
        {usdValue}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 font-mono">
        {readerBalance ? formatTokenAmount(readerBalance.shares, tokenData.decimals) : '-'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 font-mono">
        {readerBalance ? formatTokenAmount(readerBalance.assets, tokenData.decimals) : '-'}
      </td>
    </tr>
  )
}

export function TokenBalances({
  accountAddress,
  vaultItems = [],
  vaultReaderBalances = [],
}: {
  accountAddress: string
  vaultItems?: VaultItem[]
  vaultReaderBalances?: VaultReaderBalance[]
}) {
  const { fxrpAddress, isLoading: isLoadingFxrp } = useFxrpTokenAddress()
  const fxrpBalance = useERC20Balance(fxrpAddress || '', accountAddress)
  const { hasAnyBalance: hasVaultBalance, isLoading: isLoadingVaultBalances } = useVaultTokenBalances(vaultItems, accountAddress)
  const { price: xrpPrice } = useXrpPrice()

  const hasFxrpBalance = Boolean(fxrpBalance.balance && fxrpBalance.balance > BigInt(0))

  const readerBalanceByVaultId = new Map(
    vaultReaderBalances.map((vb) => [vb.vaultId.toString(), vb])
  )

  const hasAnyReaderVaultBalance = vaultReaderBalances.some(
    (vb) => vb.shares > BigInt(0) || vb.assets > BigInt(0)
  )

  if (isLoadingFxrp || fxrpBalance.isLoading) {
    return null
  }

  return (
    <>
      {fxrpAddress && hasFxrpBalance && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Token Balances:</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg border border-gray-200">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Symbol</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Address</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Balance (XRP)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Asset Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Asset Symbol</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Asset Manager</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <FxrpTokenRow tokenAddress={fxrpAddress} accountAddress={accountAddress} />
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!isLoadingVaultBalances && (hasVaultBalance || hasAnyReaderVaultBalance) && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Vault Token Balances:</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg border border-gray-200">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Symbol</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Address</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Balance (XRP)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Balance (USD)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Shares</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Assets (FXRP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vaultItems.map(({ tokenAddress, vaultId }) => (
                  <VaultTokenRow
                    key={tokenAddress}
                    tokenAddress={tokenAddress}
                    accountAddress={accountAddress}
                    xrpPrice={xrpPrice}
                    readerBalance={readerBalanceByVaultId.get(vaultId.toString())}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
