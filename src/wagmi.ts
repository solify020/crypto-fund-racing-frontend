import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'CryptoFund Racing',
  projectId: 'd6c03dc749e4e3f5dc162e7891aedc75', // Get from https://cloud.walletconnect.com
  chains: [base, sepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});