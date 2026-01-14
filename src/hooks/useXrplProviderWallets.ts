'use client'

import { useReadIMasterAccountController } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { MASTER_ACCOUNT_CONTROLLER_ADDRESS } from '../lib/constants'

export function useXrplProviderWallets() {
  const { data: wallets, isLoading, error } = useReadIMasterAccountController({
    address: MASTER_ACCOUNT_CONTROLLER_ADDRESS,
    functionName: 'getXrplProviderWallets',
  })

  return {
    wallets,
    isLoading,
    error,
  }
}
