'use client'

import { useMasterAccountVaults } from '../hooks/useMasterAccountVaults'
import { getExplorerAddressUrl, formatAddress } from '../lib/utils'
import { getMergedVaults, getVaultTypeName, getVaultTypeBadgeClasses } from '../lib/vaultUtils'

export function MasterAccountVaults() {
  const { vaults, isLoading, error } = useMasterAccountVaults()

  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="mb-4">
        <p className="font-bold text-gray-900">Master Account Vaults</p>
      </div>
      {isLoading ? (
        <p className="text-gray-800">Loading vaults...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error.message}</p>
      ) : vaults ? (
        (() => {
          const mergedVaults = getMergedVaults(vaults)
          return mergedVaults.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Vault ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Vault Address</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Vault Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mergedVaults.map((vault, index: number) => {
                    const addressStr = typeof vault.vaultAddress === 'string' 
                      ? vault.vaultAddress 
                      : (typeof vault.vaultAddress === 'bigint' ? vault.vaultAddress.toString() : String(vault.vaultAddress || ''))
                    const isAddress = addressStr.startsWith('0x') && addressStr.length === 42
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {vault.vaultId !== null && vault.vaultId !== undefined 
                            ? (typeof vault.vaultId === 'bigint' ? vault.vaultId.toString() : String(vault.vaultId))
                            : index + 1
                          }
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {isAddress ? (
                            <a
                              href={getExplorerAddressUrl(addressStr)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#E6007A] hover:text-[#C40066] underline font-mono"
                            >
                              {formatAddress(addressStr)}
                            </a>
                          ) : (
                            <span className="text-gray-500 font-mono">{addressStr || 'N/A'}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vault.vaultType !== null && vault.vaultType !== undefined ? getVaultTypeBadgeClasses(vault.vaultType) : 'bg-gray-100 text-gray-800'}`}>
                            {vault.vaultType !== null && vault.vaultType !== undefined 
                              ? getVaultTypeName(vault.vaultType)
                              : 'N/A'
                            }
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No vaults found</p>
          )
        })()
      ) : (
        <p className="text-gray-600">No vaults data available</p>
      )}
    </div>
  )
}
