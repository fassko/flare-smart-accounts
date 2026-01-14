'use client'

import { getExplorerAddressUrl } from '../lib/utils'
import { MASTER_ACCOUNT_CONTROLLER_ADDRESS } from '../lib/constants'

export function ContractHeader() {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-sm text-gray-700">
        Smart Account Master Controller:{' '}
        <a
          href={getExplorerAddressUrl(MASTER_ACCOUNT_CONTROLLER_ADDRESS)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E6007A] hover:text-[#C40066] underline font-mono"
        >
          {MASTER_ACCOUNT_CONTROLLER_ADDRESS}
        </a>
      </p>
    </div>
  )
}
