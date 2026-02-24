'use client'

import { useNetworkContext, flareTestnet, flare } from '../context/NetworkContext'

export function NetworkSwitcher() {
  const { chainId, setChainId } = useNetworkContext()

  return (
    <div className="flex items-center gap-1 rounded-lg p-1" style={{ backgroundColor: '#fce4f0' }}>
      <button
        onClick={() => setChainId(flare.id)}
        className="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
        style={
          chainId === flare.id
            ? { backgroundColor: '#E6007A', color: '#ffffff', boxShadow: '0 1px 3px rgba(230,0,122,0.4)' }
            : { color: '#C40066' }
        }
      >
        Flare
      </button>
      <button
        onClick={() => setChainId(flareTestnet.id)}
        className="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
        style={
          chainId === flareTestnet.id
            ? { backgroundColor: '#E6007A', color: '#ffffff', boxShadow: '0 1px 3px rgba(230,0,122,0.4)' }
            : { color: '#C40066' }
        }
      >
        Coston2
      </button>
    </div>
  )
}
