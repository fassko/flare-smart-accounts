'use client'

import { useReadIMasterAccountController } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { MASTER_ACCOUNT_CONTROLLER_ADDRESS } from '../lib/constants'

export function useDefaultInstructionFee() {
  const { data: fee, isLoading, error } = useReadIMasterAccountController({
    address: MASTER_ACCOUNT_CONTROLLER_ADDRESS,
    functionName: 'getDefaultInstructionFee',
  })

  return {
    fee,
    isLoading,
    error,
  }
}
