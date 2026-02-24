import { createConfig, http } from 'wagmi';
import { flareTestnet, flare } from '@wagmi/chains';

export const config = createConfig({
  chains: [flareTestnet, flare],
  connectors: [],
  transports: {
    [flareTestnet.id]: http(),
    [flare.id]: http(),
  },
});