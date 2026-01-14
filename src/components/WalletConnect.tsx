'use client'

import { useConnection, useConnectors, useConnect, useDisconnect } from 'wagmi'
import { ClientOnly } from './ClientOnly'
import { getExplorerAddressUrl, formatAddress } from '../lib/utils'

function WalletConnectInner() {
  const { address, isConnected } = useConnection()
  const connectors = useConnectors()
  const { mutate: connect } = useConnect()
  const { mutate: disconnect } = useDisconnect()

  // Find the injected connector or use the first available connector
  const injectedConnector = connectors.find((connector) => connector.type === 'injected') || connectors[0]

  const handleConnect = () => {
    if (injectedConnector) {
      connect({ connector: injectedConnector })
    }
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">
          Connected:{' '}
          <a
            href={getExplorerAddressUrl(address)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E6007A] hover:text-[#C40066] underline"
          >
            {formatAddress(address)}
          </a>
        </span>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors cursor-pointer"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      className="px-4 py-2 bg-[#E6007A] text-white rounded hover:bg-[#C40066] transition-colors cursor-pointer"
    >
      Connect Wallet
    </button>
  )
}

export function WalletConnect() {
  return (
    <ClientOnly>
      <WalletConnectInner />
    </ClientOnly>
  )
}