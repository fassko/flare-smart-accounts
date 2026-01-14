'use client'

import dynamic from 'next/dynamic'

interface ClientOnlyProps {
  children: React.ReactNode
}

function ClientOnlyComponent({ children }: ClientOnlyProps) {
  return <>{children}</>
}

export const ClientOnly = dynamic(() => Promise.resolve(ClientOnlyComponent), {
  ssr: false
})