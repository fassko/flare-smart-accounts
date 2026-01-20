import { createConfig, http } from 'wagmi'
import { flareTestnet } from '@wagmi/chains'

export const config = createConfig({
  chains: [flareTestnet],
  connectors: [],
  transports: {
    [flareTestnet.id]: http(),
  },
})