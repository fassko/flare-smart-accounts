'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { WagmiProvider } from 'wagmi'

import { config } from '../lib/wagmi'
import { NetworkProvider } from '../context/NetworkContext'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <NetworkProvider>
          {children}
        </NetworkProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}