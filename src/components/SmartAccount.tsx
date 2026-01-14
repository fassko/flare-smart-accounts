'use client'

import { useConnection } from 'wagmi'
import { ClientOnly } from './ClientOnly'
import { ContractHeader } from './ContractHeader'
import { MasterAccountVaults } from './MasterAccountVaults'
import { XrplProviderWallets } from './XrplProviderWallets'
import { AgentVaults } from './AgentVaults'
import { PersonalAccountForm } from './PersonalAccountForm'

function SmartAccountInner() {
  const { isConnected } = useConnection()

  if (!isConnected) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-700">Please connect your wallet to view data.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <ContractHeader />
      <MasterAccountVaults />
      <div className="mt-6">
        <XrplProviderWallets />
      </div>
      <div className="mt-6">
        <AgentVaults />
      </div>
      <div className="mt-6">
        <PersonalAccountForm />
      </div>
    </div>
  )
}

export function SmartAccount() {
  return (
    <ClientOnly>
      <SmartAccountInner />
    </ClientOnly>
  )
}
