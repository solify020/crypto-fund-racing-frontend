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
  provider: ethers.Provider | null;
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

  // Initialize read-only contract service for both Base and Sepolia
  useEffect(() => {
    const initializeMultiChainService = async () => {
      // Define provider configurations for different networks
      const networkConfigs = [
        // Base Mainnet
        {
          networkName: 'Base Mainnet',
          chainId: '0x2105', // Base mainnet chain ID in hex
          baseUrl: 'https://mainnet.base.org',
          providers: [
            'https://base-mainnet.g.alchemy.com/v2/demo',
            'https://mainnet.base.org',
            'https://base.gateway.tenderly.co',
            'https://1rpc.io/base'
          ]
        },
        // Sepolia Testnet
        {
          networkName: 'Sepolia Testnet',
          chainId: '0xaa36a7', // Sepolia testnet chain ID in hex
          baseUrl: 'https://rpc.sepolia.org',
          providers: [
            'https://sepolia.drpc.org',
            'https://rpc.sepolia.org',
            'https://ethereum-sepolia-rpc.publicnode.com',
            'https://1rpc.io/sepolia'
          ]
        }
      ];

      // Try each network until we find one that works
      for (const network of networkConfigs) {
        console.log(`Attempting to connect to ${network.networkName}...`);
        
        let providerConnected = false;
        
        for (const providerUrl of network.providers) {
          try {
            const readOnlyProvider = new ethers.JsonRpcProvider(providerUrl);
            
            // Test the provider by getting network info
            const networkInfo = await readOnlyProvider.getNetwork();
            const currentChainId = '0x' + networkInfo.chainId.toString(16);
            
            // Check if this is the expected network
            if (currentChainId === network.chainId ||
                (network.networkName === 'Base Mainnet' && networkInfo.chainId === 8453n) ||
                (network.networkName === 'Sepolia Testnet' && networkInfo.chainId === 11155111n)) {
              
              console.log(`Successfully connected to ${network.networkName} via ${providerUrl}`);
              
              // Initialize read-only contract service for this network
              const readOnlyService = new ContractService(readOnlyProvider);
              setContractService(readOnlyService);
              console.log(`${network.networkName} read-only contract service initialized successfully`);
              
              providerConnected = true;
              break;
            } else {
              console.log(`Wrong network connected via ${providerUrl}. Expected ${network.chainId}, got ${currentChainId}`);
            }
          } catch (error) {
            console.warn(`Provider ${providerUrl} failed for ${network.networkName}:`, error);
            continue;
          }
        }
        
        if (providerConnected) {
          break; // Success, exit the network loop
        }
      }
      
      // If no provider worked, show fallback message
      if (!contractService) {
        console.warn('Failed to connect to any read-only provider. Campaign data will be limited.');
        // Don't set contractService to null, let components handle fallback gracefully
      }
    };

    initializeMultiChainService();
  }, []);

  const updateWalletState = async (ethereum: MetamaskProvider): Promise<void> => {
    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      
      if (accounts.length > 0) {
        const browserProvider = new ethers.BrowserProvider(ethereum);
        const signer = await browserProvider.getSigner();
        const balance = await browserProvider.getBalance(accounts[0]);
        
        setProvider(browserProvider);
        setSigner(signer);

        // Initialize contract service
        const service = initializeContractService(browserProvider, signer);
        await service.setProvider(browserProvider);
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