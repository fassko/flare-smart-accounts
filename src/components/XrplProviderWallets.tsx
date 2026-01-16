'use client'

import { useXrplProviderWallets } from '../hooks/useXrplProviderWallets'
import { getExplorerAddressUrl, getXrplExplorerAddressUrl, formatAddress, isXrplAddress } from '../lib/utils'

export function XrplProviderWallets() {
  const { wallets, isLoading, error } = useXrplProviderWallets()

  return (
    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
      <div className="mb-4">
        <p className="font-bold text-gray-900">XRPL Provider Wallets</p>
      </div>
      {isLoading ? (
        <p className="text-gray-800">Loading wallets...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error.message}</p>
      ) : wallets && Array.isArray(wallets) && wallets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Wallet ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Wallet Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {wallets.map((wallet: unknown, index: number) => {
                const walletStr = typeof wallet === 'string' 
                  ? wallet 
                  : (typeof wallet === 'bigint' ? wallet.toString() : String(wallet || ''))
                const isEthereumAddress = walletStr.startsWith('0x') && walletStr.length === 42
                const isXrplAddr = isXrplAddress(walletStr)
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {isXrplAddr ? (
                        <a
                          href={getXrplExplorerAddressUrl(walletStr)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#E6007A] hover:text-[#C40066] underline font-mono"
                        >
                          {formatAddress(walletStr)}
                        </a>
                      ) : isEthereumAddress ? (
                        <a
                          href={getExplorerAddressUrl(walletStr)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#E6007A] hover:text-[#C40066] underline font-mono"
                        >
                          {formatAddress(walletStr)}
                        </a>
                      ) : (
                        <span className="text-gray-500 font-mono">{walletStr || 'N/A'}</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No wallets found</p>
      )}
    </div>
  )
}
