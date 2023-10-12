import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import * as React from 'react';
import NextHead from 'next/head';
import { chain, createClient, WagmiConfig, configureChains } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { base, linea, polygonZk, zkSyncEra, zora } from '@/network-config/network-config';
import '@rainbow-me/rainbowkit/styles.css';
import { darkTheme, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';


const { chains, provider } = configureChains(
  [chain.mainnet, chain.sepolia, chain.hardhat, chain.arbitrum, chain.optimism, base, linea, polygonZk, zkSyncEra, zora],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'GreeterDeployer',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});


export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider initialChain={chain.sepolia} theme={darkTheme({
      accentColor: '#4A4747',
      accentColorForeground: 'white',
      borderRadius: 'small',
    })} chains={chains} coolMode>
      <NextHead>
        <title>GreeterDeployer </title>
      </NextHead>
      <Component {...pageProps} />
    </RainbowKitProvider>
  </WagmiConfig>
  )
}
