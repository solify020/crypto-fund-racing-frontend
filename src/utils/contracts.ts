import { ethers } from 'ethers';
import { CryptoFundRacingABI, PoolABI, CONTRACT_ADDRESSES } from '../abi';

export class ContractService {
  private provider: ethers.Provider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private cryptoFundRacingContract: ethers.Contract | null = null;
  private poolContracts: Map<string, ethers.Contract> = new Map();

  constructor(provider?: ethers.Provider, signer?: ethers.JsonRpcSigner) {
    this.provider = provider || null;
    this.signer = signer || null;
    this.initializeContracts();
  }

  async setProvider(provider: ethers.Provider) {
    this.provider = provider;
    await this.initializeContracts();
  }

  async setSigner(signer: ethers.JsonRpcSigner) {
    this.signer = signer;
    await this.initializeContracts();
  }

  private async initializeContracts() {
    if (!this.provider) return;

    try {
      // Get the appropriate contract address based on network
      const contractAddress = await this.getContractAddressForNetwork();

      // Initialize main contract (read-only operations work without signer)
      this.cryptoFundRacingContract = new ethers.Contract(
        contractAddress,
        CryptoFundRacingABI.abi,
        this.signer || this.provider
      );
    } catch (error) {
      console.warn('Failed to initialize contract:', error);
    }
  }

  private async getContractAddressForNetwork(): Promise<string> {
    if (!this.provider) return CONTRACT_ADDRESSES.CRYPTO_FUND_RACING;

    try {
      const network = await this.provider.getNetwork();
      const chainId = network.chainId;
      
      console.log(`🔍 Detected network: Chain ID ${chainId}`);

      // Base Mainnet Chain ID is 8453
      if (chainId === 8453n) {
        const address = CONTRACT_ADDRESSES.BASE_MAINNET.CRYPTO_FUND_RACING;
        console.log(`📍 Using Base Mainnet contract address: ${address}`);
        return address;
      }

      // Sepolia Testnet Chain ID is 11155111
      if (chainId === 11155111n) {
        const address = CONTRACT_ADDRESSES.SEPOLIA_TESTNET.CRYPTO_FUND_RACING;
        console.log(`📍 Using Sepolia contract address: ${address}`);
        return address;
      }

      // Default to local development
      const defaultAddress = CONTRACT_ADDRESSES.CRYPTO_FUND_RACING;
      console.log(`📍 Using default contract address: ${defaultAddress}`);
      return defaultAddress;
    } catch (error) {
      console.warn('⚠️ Could not detect network, using default address:', error);
      return CONTRACT_ADDRESSES.CRYPTO_FUND_RACING;
    }
  }

  private getPoolContract(poolAddress: string): ethers.Contract {
    if (!this.poolContracts.has(poolAddress)) {
      const contract = new ethers.Contract(
        poolAddress,
        PoolABI.abi,
        this.signer || this.provider!
      );
      this.poolContracts.set(poolAddress, contract);
    }
    return this.poolContracts.get(poolAddress)!;
  }

  // Main contract methods
  async createPool(goal: string, durationInHours: number, socialLink: string = "", purpose: string = "", imageUrl: string = ""): Promise<string> {
    if (!this.cryptoFundRacingContract || !this.signer) {
      throw new Error('Contract not initialized or wallet not connected');
    }

    const goalWei = ethers.parseEther(goal);
    const tx = await this.cryptoFundRacingContract.createPool(goalWei, durationInHours, socialLink, purpose, imageUrl);
    const receipt = await tx.wait();
    return receipt.hash;
  }

  async getAllPools(): Promise<string[]> {
    if (!this.cryptoFundRacingContract) {
      throw new Error('Contract not initialized');
    }

    return await this.cryptoFundRacingContract.getAllPools();
  }

  async getPoolsByOwner(owner: string): Promise<string[]> {
    if (!this.cryptoFundRacingContract) {
      throw new Error('Contract not initialized');
    }

    return await this.cryptoFundRacingContract.getPoolsByOwner(owner);
  }

  // Pool contract methods
  async contributeToPool(poolAddress: string, amount: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    const poolContract = this.getPoolContract(poolAddress);
    const tx = await poolContract.contribute({ value: ethers.parseEther(amount) });
    const receipt = await tx.wait();
    return receipt.hash;
  }

  async withdrawFromPool(poolAddress: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    const poolContract = this.getPoolContract(poolAddress);
    const tx = await poolContract.withdraw();
    const receipt = await tx.wait();
    return receipt.hash;
  }

  async withdrawToFromPool(poolAddress: string, to: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    const poolContract = this.getPoolContract(poolAddress);
    const tx = await poolContract.withdrawTo(to);
    const receipt = await tx.wait();
    return receipt.hash;
  }

  async refundFromPool(poolAddress: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    const poolContract = this.getPoolContract(poolAddress);
    const tx = await poolContract.refund();
    const receipt = await tx.wait();
    return receipt.hash;
  }

  async getPoolDetails(poolAddress: string) {
    const poolContract = this.getPoolContract(poolAddress);

    const poolInfo = await poolContract.getPoolInfo();
    const isFinished = await poolContract.getIsFinished();

    return {
      address: poolAddress,
      owner: poolInfo.owner,
      goal: ethers.formatEther(poolInfo.goal),
      deadline: new Date(Number(poolInfo.deadline) * 1000),
      totalContributed: ethers.formatEther(poolInfo.totalContributed),
      socialLink: poolInfo.socialLink,
      purpose: poolInfo.purpose,
      imageUrl: poolInfo.imageUrl,
      isFinished
    };
  }

  async getContribution(poolAddress: string, contributor: string): Promise<string> {
    const poolContract = this.getPoolContract(poolAddress);
    const contribution = await poolContract.contributions(contributor);
    return ethers.formatEther(contribution);
  }

  // Utility methods
  async isDeadlinePassed(poolAddress: string): Promise<boolean> {
    const poolDetails = await this.getPoolDetails(poolAddress);
    return poolDetails.deadline.getTime() < Date.now();
  }

  async canWithdraw(poolAddress: string, owner: string): Promise<boolean> {
    const poolDetails = await this.getPoolDetails(poolAddress);

    return poolDetails.owner.toLowerCase() === owner.toLowerCase() &&
           parseFloat(poolDetails.totalContributed) >= parseFloat(poolDetails.goal);
  }

  async canRefund(poolAddress: string): Promise<boolean> {
    const poolDetails = await this.getPoolDetails(poolAddress);
    const deadlinePassed = await this.isDeadlinePassed(poolAddress);

    return deadlinePassed &&
           parseFloat(poolDetails.totalContributed) < parseFloat(poolDetails.goal);
  }
}

// Singleton instance
let contractService: ContractService | null = null;

export const getContractService = (): ContractService => {
  if (!contractService) {
    contractService = new ContractService();
  }
  return contractService;
};

export const initializeContractService = (provider: ethers.Provider, signer: ethers.JsonRpcSigner) => {
  if (!contractService) {
    contractService = new ContractService(provider, signer);
  } else {
    contractService.setProvider(provider);
    contractService.setSigner(signer);
  }
  return contractService;
};