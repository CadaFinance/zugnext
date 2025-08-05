import { createConfig, http } from 'wagmi'
import { mainnet, bsc, holesky } from 'wagmi/chains'
import { walletConnect, metaMask } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || '8854ffe902172613202b1442500a8f1e'

export const config = createConfig({
  chains: [holesky, mainnet, bsc],
  connectors: [
    walletConnect({ projectId }),
    metaMask(),
  ],
  transports: {
    [holesky.id]: http(),
    [mainnet.id]: http(),
    [bsc.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
} 