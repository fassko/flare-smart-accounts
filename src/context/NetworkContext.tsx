'use client'

import { createContext, useContext, useState } from 'react'
import { flareTestnet, flare } from '@wagmi/chains'

type NetworkContextType = {
  chainId: number
  setChainId: (id: number) => void
  isTestnet: boolean
}

const NetworkContext = createContext<NetworkContextType>({
  chainId: flare.id,
  setChainId: () => {},
  isTestnet: false,
})

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [chainId, setChainId] = useState(flare.id)

  return (
    <NetworkContext.Provider value={{ chainId, setChainId, isTestnet: chainId === flareTestnet.id }}>
      {children}
    </NetworkContext.Provider>
  )
}

export function useNetworkContext() {
  return useContext(NetworkContext)
}

export { flareTestnet, flare }
