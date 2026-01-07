import { http, createConfig } from 'wagmi';
import { mainnet, base, arbitrum, optimism } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, base, arbitrum, optimism],
  connectors: [
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
  },
});
