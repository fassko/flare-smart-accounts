'use client'

import { useReadIMasterAccountController } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { MASTER_ACCOUNT_CONTROLLER_ADDRESS } from '../lib/constants'

export function useAgentVaults() {
  const { data: agentVaults, isLoading, error } = useReadIMasterAccountController({
    address: MASTER_ACCOUNT_CONTROLLER_ADDRESS,
    functionName: 'getAgentVaults',
  })

  return {
    agentVaults,
    isLoading,
    error,
  }
}
