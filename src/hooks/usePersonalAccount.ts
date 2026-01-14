'use client'

import { useReadIMasterAccountController } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { MASTER_ACCOUNT_CONTROLLER_ADDRESS } from '../lib/constants'

export function usePersonalAccount(xrplAddress?: string) {
  const { data: personalAccount, isLoading, error } = useReadIMasterAccountController({
    address: MASTER_ACCOUNT_CONTROLLER_ADDRESS,
    functionName: 'getPersonalAccount',
    args: xrplAddress ? [xrplAddress] : undefined,
    query: {
      enabled: !!xrplAddress,
    },
  })

  return {
    personalAccount,
    isLoading,
    error,
  }
}
