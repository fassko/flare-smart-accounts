'use client'

import { useReadContract } from 'wagmi'
import { iMasterAccountControllerAbi as coston2Abi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'
import { iMasterAccountControllerAbi as flareAbi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/flare'
import { useMasterAccountControllerAddress } from './useMasterAccountControllerAddress'
import { useNetworkContext } from '../context/NetworkContext'

export function usePersonalAccount(xrplAddress?: string) {
  const { masterAccountControllerAddress } = useMasterAccountControllerAddress()
  const { chainId, isTestnet } = useNetworkContext()
  const abi = isTestnet ? coston2Abi : flareAbi

  const { data: personalAccount, isLoading, error } = useReadContract({
    address: masterAccountControllerAddress,
    abi,
    functionName: 'getPersonalAccount',
    args: xrplAddress ? [xrplAddress] : undefined,
    chainId,
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
