'use client'

import { useERC20Balance } from '../hooks/useTokenBalances'
import { useFxrpTokenAddress } from '../hooks/useFxrpTokenAddress'
import { getExplorerAddressUrl, formatAddress } from '../lib/utils'

// Component to render a single ERC20 token balance row
function ERC20TokenRow({ tokenAddress, accountAddress }: { tokenAddress: string; accountAddress: string }) {
  const tokenData = useERC20Balance(tokenAddress, accountAddress)

  if (!tokenData.balance || tokenData.balance === BigInt(0)) return null

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-700 font-medium">
        {tokenData.symbol || tokenData.name || formatAddress(tokenAddress)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        <a
          href={getExplorerAddressUrl(tokenAddress)}
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
          href={getExplorerAddressUrl(tokenData.assetManager)}
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

export function TokenBalances({ accountAddress }: { accountAddress: string }) {
  const { fxrpAddress, isLoading: isLoadingFxrp } = useFxrpTokenAddress()

  const allTokenAddresses = fxrpAddress ? [fxrpAddress] : []

  if (isLoadingFxrp) {
    return <p className="text-sm text-gray-600">Loading token balances...</p>
  }

  // Check if we have any balances to show
  if (allTokenAddresses.length === 0) {
    return <p className="text-sm text-gray-600">No token balances found</p>
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
            {allTokenAddresses.map((tokenAddress, index) => (
              <ERC20TokenRow key={`erc20-${index}`} tokenAddress={tokenAddress} accountAddress={accountAddress} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
