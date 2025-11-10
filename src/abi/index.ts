import CryptoFundRacingABI from './CryptoFundRacing.json';
import PoolABI from './Pool.json';

export { CryptoFundRacingABI, PoolABI };

// Contract addresses - these should be updated with deployed contract addresses
export const CONTRACT_ADDRESSES = {
  CRYPTO_FUND_RACING: '0x7698A966a839f1A3574ab3797487F7061f12bac2', // Local development address
  // Base Mainnet deployed addresses
  BASE_MAINNET: {
    CRYPTO_FUND_RACING: '0x0000000000000000000000000000000000000000', // Replace with actual deployed address
  },
  // Sepolia Testnet deployed addresses
  SEPOLIA_TESTNET: {
    CRYPTO_FUND_RACING: '0x7698A966a839f1A3574ab3797487F7061f12bac2', // Replace with actual deployed address
  },
} as const;

export type ContractAddress = typeof CONTRACT_ADDRESSES[keyof typeof CONTRACT_ADDRESSES];