'use client'

import { getExplorerAddressUrl, formatAddress } from '../lib/utils'
import { getVaultTypeName, getVaultTypeBadgeClasses } from '../lib/vaultUtils'

export interface VaultWithDetails {
  vaultId: unknown
  vaultAddress: unknown
  vaultType: unknown
  name: string | undefined
  symbol: string | undefined
  decimals: number | undefined
  balance: bigint | undefined
}

export function VaultBalances({ vaultsWithDetails }: { vaultsWithDetails: VaultWithDetails[] }) {
  const vaultsWithPositiveBalance = vaultsWithDetails.filter(
    (vault) => vault.balance && vault.balance > BigInt(0)
  )

  if (vaultsWithPositiveBalance.length === 0) return null

  const formatBalance = (balance: bigint | undefined, decimals: number | undefined) => {
    if (!balance) return '0'
    const dec = decimals ?? 18
    return (Number(balance) / Math.pow(10, dec)).toLocaleString('en-US', {
      maximumFractionDigits: 6,
    })
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Vault Balances:</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Vault ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Vault Address</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Vault Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Symbol</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vaultsWithPositiveBalance.map((vault, index) => (
              <tr key={`vault-${index}`} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {vault.vaultId !== null && vault.vaultId !== undefined
                    ? (typeof vault.vaultId === 'bigint' ? vault.vaultId.toString() : String(vault.vaultId))
                    : 'N/A'
                  }
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <a
                    href={getExplorerAddressUrl(vault.vaultAddress as string)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E6007A] hover:text-[#C40066] underline font-mono"
                  >
                    {formatAddress(vault.vaultAddress as string)}
                  </a>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vault.vaultType !== null && vault.vaultType !== undefined ? getVaultTypeBadgeClasses(vault.vaultType) : 'bg-gray-100 text-gray-800'}`}>
                    {vault.vaultType !== null && vault.vaultType !== undefined
                      ? getVaultTypeName(vault.vaultType)
                      : 'N/A'
                    }
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {vault.name || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {vault.symbol || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 font-mono">
                  {formatBalance(vault.balance, vault.decimals)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
