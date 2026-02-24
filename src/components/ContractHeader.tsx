'use client'

import { getExplorerAddressUrl } from '../lib/utils'
import { DROPS_PER_XRP } from '../lib/constants'
import { useDefaultInstructionFee } from '../hooks/useDefaultInstructionFee'
import { useMasterAccountControllerAddress } from '../hooks/useMasterAccountControllerAddress'
import { useNetworkContext } from '../context/NetworkContext'

function formatDropsToXrp(drops: bigint): string {
  const xrp = Number(drops) / Number(DROPS_PER_XRP)
  return xrp.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 6 })
}

export function ContractHeader() {
  const { fee, isLoading, error } = useDefaultInstructionFee()
  const { masterAccountControllerAddress } = useMasterAccountControllerAddress()
  const { isTestnet } = useNetworkContext()

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
      <p className="text-sm text-gray-700">
        Smart Account Master Controller:{' '}
        {masterAccountControllerAddress ? (
          <a
            href={getExplorerAddressUrl(masterAccountControllerAddress, isTestnet)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E6007A] hover:text-[#C40066] underline font-mono"
          >
            {masterAccountControllerAddress}
          </a>
        ) : (
          <span className="text-gray-400">Loading...</span>
        )}
      </p>
      <p className="text-sm text-gray-700">
        Default Instruction Fee:{' '}
        {isLoading ? (
          <span className="text-gray-400">Loading...</span>
        ) : error ? (
          <span className="text-red-500">Error loading fee</span>
        ) : fee !== undefined ? (
          <span className="font-mono">
            {fee.toString()} drops ({formatDropsToXrp(fee as bigint)} XRP)
          </span>
        ) : null}
      </p>
    </div>
  )
}
