export interface MetamaskProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
}

export interface WalletState {
  account: string | null;
  balance: string;
  chainId: string | null;
  isConnected: boolean;
  isConnecting: boolean;
}

export interface Campaign {
  id: string;
  address: string; // Contract address of the pool
  title: string;
  description: string;
  targetAmount: string;
  currentAmount: string;
  creator: string;
  deadline: Date;
  isActive: boolean;
  isFinished?: boolean;
  image?: string;
  socialLink?: string;
  socialLinks?: {
    twitter?: string;
    discord?: string;
    telegram?: string;
    website?: string;
  };
}

export interface PoolDetails {
  address: string;
  owner: string;
  goal: string;
  deadline: Date;
  totalContributed: string;
  socialLink: string;
  purpose: string;
  isFinished: boolean;
}

export interface DonationTransaction {
  hash: string;
  amount: string;
  from: string;
  to: string;
  timestamp: Date;
  campaignId: string;
}

declare global {
  interface Window {
    ethereum?: MetamaskProvider;
  }
}