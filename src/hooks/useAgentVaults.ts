'use client'

import { useReadIMasterAccountController } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { useMasterAccountControllerAddress } from './useMasterAccountControllerAddress'

export function useAgentVaults() {
  const { masterAccountControllerAddress } = useMasterAccountControllerAddress()

  const { data: agentVaults, isLoading, error } = useReadIMasterAccountController({
    address: masterAccountControllerAddress,
    functionName: 'getAgentVaults',
  })

  return {
    agentVaults,
    isLoading,
    error,
  }
}
