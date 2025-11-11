import CryptoFundRacingABI from './CryptoFundRacing.json';
import PoolABI from './Pool.json';

export { CryptoFundRacingABI, PoolABI };

// Contract addresses - these should be updated with deployed contract addresses
export const CONTRACT_ADDRESSES = {
  CRYPTO_FUND_RACING: '0xDF9EDeE0A8c23de26bB71a298c2B0831Fc7bC65b', // Local development address
  // Base Mainnet deployed addresses
  BASE_MAINNET: {
    CRYPTO_FUND_RACING: '0x0000000000000000000000000000000000000000', // Replace with actual deployed address
  },
  // Sepolia Testnet deployed addresses
  SEPOLIA_TESTNET: {
    CRYPTO_FUND_RACING: '0xDF9EDeE0A8c23de26bB71a298c2B0831Fc7bC65b', // Replace with actual deployed address
  },
} as const;

export type ContractAddress = typeof CONTRACT_ADDRESSES[keyof typeof CONTRACT_ADDRESSES];