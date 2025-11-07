import CryptoFundRacingABI from './CryptoFundRacing.json';
import PoolABI from './Pool.json';

export { CryptoFundRacingABI, PoolABI };

// Contract addresses - these should be updated with deployed contract addresses
export const CONTRACT_ADDRESSES = {
  CRYPTO_FUND_RACING: '0x131ce2c464E60649CBC27df91F1C3dcEe158Bb93', // Local development address
  // Add deployed addresses for different networks here
} as const;

export type ContractAddress = typeof CONTRACT_ADDRESSES[keyof typeof CONTRACT_ADDRESSES];