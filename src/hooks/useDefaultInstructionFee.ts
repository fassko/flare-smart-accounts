'use client'

import { useReadIMasterAccountController } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { useMasterAccountControllerAddress } from './useMasterAccountControllerAddress'

export function useDefaultInstructionFee() {
  const { masterAccountControllerAddress } = useMasterAccountControllerAddress()

  const { data: fee, isLoading, error } = useReadIMasterAccountController({
    address: masterAccountControllerAddress,
    functionName: 'getDefaultInstructionFee',
  })

  return {
    fee,
    isLoading,
    error,
  }
}
