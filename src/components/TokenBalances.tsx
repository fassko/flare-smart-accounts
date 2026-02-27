'use client'

import { useERC20Balance } from '../hooks/useTokenBalances'
import { useFxrpTokenAddress } from '../hooks/useFxrpTokenAddress'
import { getExplorerAddressUrl, formatAddress } from '../lib/utils'
import { useNetworkContext } from '../context/NetworkContext'

function ERC20TokenRow({ tokenAddress, accountAddress }: { tokenAddress: string; accountAddress: string }) {
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

export function TokenBalances({ accountAddress, additionalTokenAddresses = [] }: { accountAddress: string; additionalTokenAddresses?: string[] }) {
  const { fxrpAddress, isLoading: isLoadingFxrp } = useFxrpTokenAddress()
  const fxrpBalance = useERC20Balance(fxrpAddress || '', accountAddress)

  const hasFxrpBalance = fxrpBalance.balance && fxrpBalance.balance > BigInt(0)

  if (isLoadingFxrp || fxrpBalance.isLoading) {
    return null
  }

  if (!fxrpAddress && additionalTokenAddresses.length === 0) {
    return null
  }

  if (!hasFxrpBalance && additionalTokenAddresses.length === 0) {
    return null
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Token Balances:</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Symbol</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Address</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Balance</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Asset Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Asset Symbol</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Asset Manager</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fxrpAddress && <ERC20TokenRow tokenAddress={fxrpAddress} accountAddress={accountAddress} />}
            {additionalTokenAddresses.map((tokenAddress) => (
              <ERC20TokenRow key={tokenAddress} tokenAddress={tokenAddress} accountAddress={accountAddress} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
