import { VAULT_TYPES, VAULT_TYPE_BADGE_CLASSES } from './constants'

export function getVaultTypeName(vaultType: number | bigint | unknown): string {
  const type = typeof vaultType === 'bigint' ? Number(vaultType) : vaultType
  return VAULT_TYPES[type as keyof typeof VAULT_TYPES] ?? `Unknown (${type})`
}

export function getVaultTypeBadgeClasses(vaultType: number | bigint | unknown): string {
  const type = typeof vaultType === 'bigint' ? Number(vaultType) : vaultType
  return VAULT_TYPE_BADGE_CLASSES[type as keyof typeof VAULT_TYPE_BADGE_CLASSES] ?? 'bg-gray-100 text-gray-800'
}

export function getMergedVaults(vaultsData: unknown): Array<{ vaultId: unknown; vaultAddress: unknown; vaultType: unknown }> {
  if (!vaultsData || !Array.isArray(vaultsData) || vaultsData.length !== 3) return []

  // Handle array/tuple structure: [vaultIds, vaultAddresses, vaultTypes]
  const vaultIds = Array.isArray(vaultsData[0]) ? vaultsData[0] : []
  const vaultAddresses = Array.isArray(vaultsData[1]) ? vaultsData[1] : []
  const vaultTypes = Array.isArray(vaultsData[2]) ? vaultsData[2] : []

  // Merge arrays by index
  const maxLength = Math.max(vaultIds.length, vaultAddresses.length, vaultTypes.length)
  
  return Array.from({ length: maxLength }, (_, i) => ({
    vaultId: vaultIds[i],
    vaultAddress: vaultAddresses[i],
    vaultType: vaultTypes[i],
  }))
}

export function getMergedAgentVaults(agentVaultsData: unknown): Array<{ agentVaultId: unknown; agentVaultAddress: unknown }> {
  if (!agentVaultsData || !Array.isArray(agentVaultsData) || agentVaultsData.length !== 2) return []

  // Handle array/tuple structure: [agentVaultIds, agentVaultAddresses]
  const agentVaultIds = Array.isArray(agentVaultsData[0]) ? agentVaultsData[0] : []
  const agentVaultAddresses = Array.isArray(agentVaultsData[1]) ? agentVaultsData[1] : []

  // Merge arrays by index
  const maxLength = Math.max(agentVaultIds.length, agentVaultAddresses.length)
  
  return Array.from({ length: maxLength }, (_, i) => ({
    agentVaultId: agentVaultIds[i],
    agentVaultAddress: agentVaultAddresses[i],
  }))
}
