import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { flareTestnet } from '@wagmi/chains'

export const config = createConfig({
  chains: [flareTestnet],
  connectors: [injected()],
  transports: {
    [flareTestnet.id]: http(),
  },
})