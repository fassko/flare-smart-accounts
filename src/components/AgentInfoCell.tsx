'use client'

import { useAgentInfo } from '../hooks/useAgentInfo'
import { useAgentName } from '../hooks/useAgentName'
import { serializeWithBigInt } from '../lib/utils'

export function AgentInfoCell({ vaultAddress }: { vaultAddress: string }) {
  const { agentInfo, isLoading } = useAgentInfo(vaultAddress)
  
  // Extract ownerManagementAddress from agentInfo
  const ownerManagementAddress = agentInfo && typeof agentInfo === 'object' && agentInfo !== null
    ? (agentInfo as Record<string, unknown>).ownerManagementAddress as string | undefined
    : undefined

  const { agentName, isLoading: isLoadingName } = useAgentName(ownerManagementAddress)

  if (isLoading) {
    return <span className="text-xs text-gray-500">Loading...</span>
  }

  if (!agentInfo) {
    return <span className="text-xs text-gray-500">No data</span>
  }

  return (
    <div>
      {isLoadingName ? (
        <span className="text-xs text-gray-500">Loading name...</span>
      ) : agentName ? (
        <span className="text-xs font-semibold text-gray-900">{String(agentName)}</span>
      ) : null}
      <details className="cursor-pointer mt-1">
        <summary className="text-xs text-[#E6007A] hover:text-[#C40066]">View details</summary>
        <pre className="mt-2 text-xs overflow-auto bg-gray-50 p-2 rounded border border-gray-200 text-black max-w-md">
          {serializeWithBigInt(agentInfo)}
        </pre>
      </details>
    </div>
  )
}
