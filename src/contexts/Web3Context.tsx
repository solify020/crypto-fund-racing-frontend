import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ethers } from 'ethers';
import type { WalletState, MetamaskProvider } from '../types/web3';
import { initializeContractService, ContractService } from '../utils/contracts';

interface Web3ContextType {
  walletState: WalletState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  sendTransaction: (to: string, amount: string) => Promise<string>;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  contractService: ContractService | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [walletState, setWalletState] = useState<WalletState>({
    account: null,
    balance: '0',
    chainId: null,
    isConnected: false,
    isConnecting: false,
  });

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [contractService, setContractService] = useState<ContractService | null>(null);

  const updateWalletState = async (ethereum: MetamaskProvider): Promise<void> => {
    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      
      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const balance = await provider.getBalance(accounts[0]);
        
        setProvider(provider);
        setSigner(signer);

        // Initialize contract service
        const service = initializeContractService(provider, signer);
        await service.setProvider(provider);
        await service.setSigner(signer);
        setContractService(service);

        setWalletState({
          account: accounts[0],
          balance: ethers.formatEther(balance),
          chainId,
          isConnected: true,
          isConnecting: false,
        });
      } else {
        setWalletState(prev => ({
          ...prev,
          account: null,
          balance: '0',
          isConnected: false,
          isConnecting: false,
        }));
        setProvider(null);
        setSigner(null);
      }
    } catch (error) {
      console.error('Error updating wallet state:', error);
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
      }));
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this application');
      return;
    }

    setWalletState(prev => ({ ...prev, isConnecting: true }));

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await updateWalletState(window.ethereum);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setWalletState(prev => ({ ...prev, isConnecting: false }));
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      account: null,
      balance: '0',
      chainId: null,
      isConnected: false,
      isConnecting: false,
    });
    setProvider(null);
    setSigner(null);
    setContractService(null);
  };

  const sendTransaction = async (to: string, amount: string): Promise<string> => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(amount),
      });

      await tx.wait();
      
      // Update balance after transaction
      if (window.ethereum) {
        await updateWalletState(window.ethereum);
      }

      return tx.hash;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      // Check if already connected
      updateWalletState(window.ethereum);

      // Listen for account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          updateWalletState(window.ethereum!);
        }
      };

      // Listen for chain changes
      const handleChainChanged = () => {
        if (window.ethereum) {
          updateWalletState(window.ethereum);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  const value: Web3ContextType = {
    walletState,
    connectWallet,
    disconnectWallet,
    sendTransaction,
    provider,
    signer,
    contractService,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};