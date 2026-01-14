'use client'

import { useAgentVaults } from '../hooks/useAgentVaults'
import { getExplorerAddressUrl, formatAddress } from '../lib/utils'
import { getMergedAgentVaults } from '../lib/vaultUtils'
import { AgentInfoCell } from './AgentInfoCell'

export function AgentVaults() {
  const { agentVaults, isLoading, error } = useAgentVaults()

  return (
    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
      <div className="mb-4">
        <p className="font-bold text-gray-900">Agent Vaults</p>
      </div>
      {isLoading ? (
        <p className="text-gray-800">Loading agent vaults...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error.message}</p>
      ) : (() => {
        const mergedAgentVaults = agentVaults ? getMergedAgentVaults(agentVaults) : []
        return mergedAgentVaults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg border border-gray-200">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Agent Vault ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Agent Vault Address</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Agent Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mergedAgentVaults.map((vault, index: number) => {
                  const addressStr = typeof vault.agentVaultAddress === 'string' 
                    ? vault.agentVaultAddress 
                    : (typeof vault.agentVaultAddress === 'bigint' ? vault.agentVaultAddress.toString() : String(vault.agentVaultAddress || ''))
                  const isAddress = addressStr.startsWith('0x') && addressStr.length === 42
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {vault.agentVaultId !== null && vault.agentVaultId !== undefined 
                          ? (typeof vault.agentVaultId === 'bigint' ? vault.agentVaultId.toString() : String(vault.agentVaultId))
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
                        {isAddress ? (
                          <AgentInfoCell vaultAddress={addressStr} />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No agent vaults found</p>
        )
      })()}
    </div>
  )
}
