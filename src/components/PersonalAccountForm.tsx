'use client'

import { useState } from 'react'
import { usePersonalAccount } from '../hooks/usePersonalAccount'
import { getExplorerAddressUrl, getXrplExplorerAddressUrl, formatAddress, isXrplAddress } from '../lib/utils'

export function PersonalAccountForm() {
  const [xrplAddressInput, setXrplAddressInput] = useState('')
  const [submittedXrplAddress, setSubmittedXrplAddress] = useState('')
  const { personalAccount, isLoading, error } = usePersonalAccount(submittedXrplAddress)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (xrplAddressInput && isXrplAddress(xrplAddressInput)) {
      setSubmittedXrplAddress(xrplAddressInput)
    }
  }

  return (
    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
      <div className="mb-4">
        <p className="font-bold text-gray-900">Get Personal Account</p>
      </div>
      <form onSubmit={handleSubmit} className="mb-4">
        <label htmlFor="xrpl-address" className="block text-sm font-medium text-gray-700 mb-2">
          XRPL Address
        </label>
        <div className="flex gap-2">
          <input
            id="xrpl-address"
            type="text"
            value={xrplAddressInput}
            onChange={(e) => setXrplAddressInput(e.target.value)}
            placeholder="rKuPyJUcMhHgjCkQaCLt5y21m4PMPpW6f"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6007A] text-gray-900 placeholder:text-gray-400 font-mono text-sm"
            required
          />
          <button
            type="submit"
            disabled={!xrplAddressInput || !isXrplAddress(xrplAddressInput)}
            className="px-4 py-2 bg-[#E6007A] text-white rounded-md hover:bg-[#C40066] disabled:bg-gray-400 disabled:cursor-not-allowed enabled:cursor-pointer transition-colors text-sm"
          >
            Get Account
          </button>
        </div>
        {xrplAddressInput && !isXrplAddress(xrplAddressInput) && (
          <p className="mt-1 text-xs text-red-600">Please enter a valid XRPL address (starts with &apos;r&apos;)</p>
        )}
      </form>
      {submittedXrplAddress && (
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm text-gray-700">Querying:</span>
            <a
              href={getXrplExplorerAddressUrl(submittedXrplAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#E6007A] hover:text-[#C40066] underline font-mono"
            >
              {formatAddress(submittedXrplAddress)}
            </a>
          </div>
          {isLoading ? (
            <p className="text-gray-800">Loading personal account...</p>
          ) : error ? (
            <p className="text-red-600">Error: {error.message}</p>
          ) : personalAccount !== null && personalAccount !== undefined ? (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Personal Account:</h3>
              {(() => {
                const accountStr = typeof personalAccount === 'string' 
                  ? personalAccount 
                  : (typeof personalAccount === 'bigint' ? personalAccount.toString() : String(personalAccount || ''))
                const isAddress = accountStr.startsWith('0x') && accountStr.length === 42
                
                return isAddress ? (
                  <a
                    href={getExplorerAddressUrl(accountStr)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E6007A] hover:text-[#C40066] underline font-mono text-sm"
                  >
                    {accountStr}
                  </a>
                ) : (
                  <p className="text-sm text-gray-700 font-mono">{accountStr}</p>
                )
              })()}
            </div>
          ) : (
            <p className="text-gray-600">No personal account found for this XRPL address</p>
          )}
        </div>
      )}
    </div>
  )
}
