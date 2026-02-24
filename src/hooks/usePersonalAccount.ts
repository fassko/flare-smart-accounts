'use client'

import { useReadIMasterAccountController } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { useMasterAccountControllerAddress } from './useMasterAccountControllerAddress'

export function usePersonalAccount(xrplAddress?: string) {
  const { masterAccountControllerAddress } = useMasterAccountControllerAddress()

  const { data: personalAccount, isLoading, error } = useReadIMasterAccountController({
    address: masterAccountControllerAddress,
    functionName: 'getPersonalAccount',
    args: xrplAddress ? [xrplAddress] : undefined,
    query: {
      enabled: !!xrplAddress && !!masterAccountControllerAddress,
    },
  })

  return {
    personalAccount,
    isLoading,
    error,
  }
}
