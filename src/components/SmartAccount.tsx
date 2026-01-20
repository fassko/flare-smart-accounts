'use client'

import { ClientOnly } from './ClientOnly'
import { ContractHeader } from './ContractHeader'
import { MasterAccountVaults } from './MasterAccountVaults'
import { XrplProviderWallets } from './XrplProviderWallets'
import { AgentVaults } from './AgentVaults'
import { PersonalAccountForm } from './PersonalAccountForm'

function SmartAccountInner() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <ContractHeader />
      <div className="mt-6">
        <PersonalAccountForm />
      </div>
      <div className="mt-6">
        <MasterAccountVaults />
      </div>
      <div className="mt-6">
        <XrplProviderWallets />
      </div>
      <div className="mt-6">
        <AgentVaults />
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
