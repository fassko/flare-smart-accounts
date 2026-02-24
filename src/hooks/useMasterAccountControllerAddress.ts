'use client'

import { useReadIFlareContractRegistry } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { FLARE_CONTRACT_REGISTRY_ADDRESS } from '../lib/constants'

export function useMasterAccountControllerAddress() {
  const { data: masterAccountControllerAddress, isLoading, error } = useReadIFlareContractRegistry({
    address: FLARE_CONTRACT_REGISTRY_ADDRESS,
    functionName: 'getContractAddressByName',
    args: ['MasterAccountController'],
  })

  return {
    masterAccountControllerAddress: masterAccountControllerAddress as `0x${string}` | undefined,
    isLoading,
    error,
  }
}
