import CryptoFundRacingABI from './CryptoFundRacing.json';
import PoolABI from './Pool.json';

export { CryptoFundRacingABI, PoolABI };

// Contract addresses - updated with working addresses
export const CONTRACT_ADDRESSES = {
  CRYPTO_FUND_RACING: '0xDF9EDeE0A8c23de26bB71a298c2B0831Fc7bC65b', // Local development address
  // Base Mainnet deployed addresses (use working test contracts)
  BASE_MAINNET: {
    CRYPTO_FUND_RACING: '0x0000000000000000000000000000000000000000', // No deployed contracts yet
  },
  // Sepolia Testnet deployed addresses (use working test contracts)
  SEPOLIA_TESTNET: {
    CRYPTO_FUND_RACING: '0xDF9EDeE0A8c23de26bB71a298c2B0831Fc7bC65b', // Development address for testing
  },
} as const;

// Check if contract address is valid (not zero address)
export const isValidContractAddress = (address: string): boolean => {
  return address !== '0x0000000000000000000000000000000000000000';
};

export type ContractAddress = typeof CONTRACT_ADDRESSES[keyof typeof CONTRACT_ADDRESSES];