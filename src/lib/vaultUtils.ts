export function getVaultTypeName(vaultType: number | bigint | unknown): string {
  const type = typeof vaultType === 'bigint' ? Number(vaultType) : vaultType
  if (type === 1) return 'Firelight'
  if (type === 2) return 'Upshift'
  return `Unknown (${type})`
}

export function getVaultTypeBadgeClasses(vaultType: number | bigint | unknown): string {
  const type = typeof vaultType === 'bigint' ? Number(vaultType) : vaultType
  if (type === 1) return 'bg-orange-100 text-orange-800'
  if (type === 2) return 'bg-green-100 text-green-800'
  return 'bg-gray-100 text-gray-800'
}

export function getMergedVaults(vaultsData: unknown): Array<{ vaultId: unknown; vaultAddress: unknown; vaultType: unknown }> {
  if (!vaultsData) return []

  let vaultIds: unknown[] = []
  let vaultAddresses: unknown[] = []
  let vaultTypes: unknown[] = []

  // Handle tuple/array structure: [vaultIds, vaultAddresses, vaultTypes]
  if (Array.isArray(vaultsData) && vaultsData.length >= 3) {
    vaultIds = Array.isArray(vaultsData[0]) ? vaultsData[0] : []
    vaultAddresses = Array.isArray(vaultsData[1]) ? vaultsData[1] : []
    vaultTypes = Array.isArray(vaultsData[2]) ? vaultsData[2] : []
  }
  // Handle object structure with _vaultIds, _vaultAddresses, _vaultTypes
  else if (typeof vaultsData === 'object' && vaultsData !== null) {
    const vaultObj = vaultsData as Record<string, unknown>
    vaultIds = Array.isArray(vaultObj._vaultIds) ? vaultObj._vaultIds : (Array.isArray(vaultObj.vaultIds) ? vaultObj.vaultIds : [])
    vaultAddresses = Array.isArray(vaultObj._vaultAddresses) ? vaultObj._vaultAddresses : (Array.isArray(vaultObj.vaultAddresses) ? vaultObj.vaultAddresses : [])
    vaultTypes = Array.isArray(vaultObj._vaultTypes) ? vaultObj._vaultTypes : (Array.isArray(vaultObj.vaultTypes) ? vaultObj.vaultTypes : [])
  }

  // Merge arrays by index
  const maxLength = Math.max(vaultIds.length, vaultAddresses.length, vaultTypes.length)
  const merged: Array<{ vaultId: unknown; vaultAddress: unknown; vaultType: unknown }> = []

  for (let i = 0; i < maxLength; i++) {
    merged.push({
      vaultId: vaultIds[i],
      vaultAddress: vaultAddresses[i],
      vaultType: vaultTypes[i],
    })
  }

  return merged
}

export function getMergedAgentVaults(agentVaultsData: unknown): Array<{ agentVaultId: unknown; agentVaultAddress: unknown }> {
  if (!agentVaultsData) return []

  let agentVaultIds: unknown[] = []
  let agentVaultAddresses: unknown[] = []

  // Handle tuple/array structure: [agentVaultIds, agentVaultAddresses]
  if (Array.isArray(agentVaultsData) && agentVaultsData.length >= 2) {
    agentVaultIds = Array.isArray(agentVaultsData[0]) ? agentVaultsData[0] : []
    agentVaultAddresses = Array.isArray(agentVaultsData[1]) ? agentVaultsData[1] : []
  }
  // Handle object structure with _agentVaultIds, _agentVaultAddresses
  else if (typeof agentVaultsData === 'object' && agentVaultsData !== null) {
    const vaultObj = agentVaultsData as Record<string, unknown>
    agentVaultIds = Array.isArray(vaultObj._agentVaultIds) ? vaultObj._agentVaultIds : (Array.isArray(vaultObj.agentVaultIds) ? vaultObj.agentVaultIds : [])
    agentVaultAddresses = Array.isArray(vaultObj._agentVaultAddresses) ? vaultObj._agentVaultAddresses : (Array.isArray(vaultObj.agentVaultAddresses) ? vaultObj.agentVaultAddresses : [])
  }

  // Merge arrays by index
  const maxLength = Math.max(agentVaultIds.length, agentVaultAddresses.length)
  const merged: Array<{ agentVaultId: unknown; agentVaultAddress: unknown }> = []

  for (let i = 0; i < maxLength; i++) {
    merged.push({
      agentVaultId: agentVaultIds[i],
      agentVaultAddress: agentVaultAddresses[i],
    })
  }

  return merged
}
