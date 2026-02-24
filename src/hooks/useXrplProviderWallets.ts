'use client'

import { useReadIMasterAccountController } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { useMasterAccountControllerAddress } from './useMasterAccountControllerAddress'

export function useXrplProviderWallets() {
  const { masterAccountControllerAddress } = useMasterAccountControllerAddress()

  const { data: wallets, isLoading, error } = useReadIMasterAccountController({
    address: masterAccountControllerAddress,
    functionName: 'getXrplProviderWallets',
  })

  return {
    wallets,
    isLoading,
    error,
  }
}
