# How to Call Smart Contracts Using ethers.js

## Basic Setup

### 1. Install ethers.js
```bash
npm install ethers
# or
yarn add ethers
```

### 2. Setup Provider and Contract Connection

```javascript
import { ethers } from 'ethers';

// Create a provider (read-only)
const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_PROJECT_ID');

// Create a contract instance
const contractAddress = '0x1234567890123456789012345678901234567890';
const abi = [
  // ABI definition
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

const contract = new ethers.Contract(contractAddress, abi, provider);
```

## Read-Only Contract Calls (View Functions)

### Reading Data from Contracts
```javascript
// Call view functions (no gas fees)
const owner = await contract.owner();
console.log('Contract owner:', owner);

// Call function with parameters
const balance = await contract.balanceOf('0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4');
console.log('Balance:', ethers.formatEther(balance));

// Get multiple values
const [totalSupply, name, symbol] = await Promise.all([
  contract.totalSupply(),
  contract.name(),
  contract.symbol()
]);
```

### Handling Different Return Types
```javascript
// Numbers (always returned as BigInt)
const amount = await contract.balanceOf(address);
const formattedAmount = ethers.formatEther(amount); // Convert to decimal

// Arrays
const users = await contract.getAllUsers();
users.forEach((user, index) => {
  console.log(`User ${index}:`, user);
});

// Structs
const poolInfo = await contract.getPoolInfo();
console.log('Pool owner:', poolInfo.owner);
console.log('Pool goal:', ethers.formatEther(poolInfo.goal));
```

## Write Contract Calls (State Changing Functions)

### With Wallet Connection (Requires Gas)
```javascript
// Setup signer for write operations
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contractWithSigner = contract.connect(signer);

// Transfer tokens
const tx = await contractWithSigner.transfer(
  '0x8ba1f109551bD432803012645Hac189451b957',
  ethers.parseEther('1.0') // 1 token
);

// Wait for confirmation
const receipt = await tx.wait();
console.log('Transaction hash:', receipt.hash);
console.log('Gas used:', receipt.gasUsed.toString());
```

### Contract Creation and Fundraising
```javascript
// Create a new pool
const tx = await contractWithSigner.createPool(
  ethers.parseEther('100'), // 100 ETH goal
  30 * 24 * 60 * 60, // 30 days in seconds
  "https://twitter.com/project", // Social link
  "My DeFi Project", // Purpose
  "https://example.com/image.jpg" // Image
);

const receipt = await tx.wait();
console.log('Pool created:', receipt.hash);
```

## Event Listening

### Subscribe to Contract Events
```javascript
// Listen for Transfer events
contract.on('Transfer', (from, to, amount, event) => {
  console.log('Transfer detected:');
  console.log('From:', from);
  console.log('To:', to);
  console.log('Amount:', ethers.formatEther(amount));
  console.log('Transaction hash:', event.transactionHash);
});

// Listen for specific pool creation
contract.on('PoolCreated', (poolAddress, creator, goal, event) => {
  console.log('New pool created:', poolAddress);
  console.log('Creator:', creator);
  console.log('Goal:', ethers.formatEther(goal));
});

// Remove event listener
contract.removeAllListeners('Transfer');
```

## Advanced Contract Interactions

### Batch Calls
```javascript
// Multiple contract calls
const calls = [
  contract.balanceOf(address1),
  contract.balanceOf(address2),
  contract.totalSupply(),
  contract.getAllPools()
];

const results = await Promise.all(calls);
const [balance1, balance2, totalSupply, allPools] = results;
```

### Manual Transaction Sending
```javascript
// Direct contract method call with custom data
const contractInterface = new ethers.Interface(abi);

// Encode function call
const data = contractInterface.encodeFunctionData('transfer', [
  recipientAddress,
  ethers.parseEther('1.0')
]);

// Send transaction
const tx = await signer.sendTransaction({
  to: contractAddress,
  data: data,
  value: 0
});

// Wait for confirmation
const receipt = await tx.wait();
```

### Error Handling
```javascript
try {
  const result = await contract.someFunction();
  console.log('Success:', result);
} catch (error) {
  if (error.code === 'CALL_EXCEPTION') {
    console.log('Contract call failed:', error.reason);
  } else if (error.code === 'INSUFFICIENT_FUNDS') {
    console.log('Insufficient funds for gas');
  } else {
    console.log('Unknown error:', error);
  }
}
```

## Real Examples from Crypto Fun Racing

### Get All Pools
```javascript
async function getAllCampaigns() {
  try {
    const poolAddresses = await contract.getAllPools();
    const campaigns = await Promise.all(
      poolAddresses.map(async (address) => {
        const poolInfo = await contract.getPoolDetails(address);
        return {
          address: poolInfo.address,
          creator: poolInfo.owner,
          goal: ethers.formatEther(poolInfo.goal),
          deadline: new Date(Number(poolInfo.deadline) * 1000),
          totalContributed: ethers.formatEther(poolInfo.totalContributed),
          isActive: !poolInfo.isFinished
        };
      })
    );
    return campaigns;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
}
```

### Contribute to Pool
```javascript
async function contributeToPool(poolAddress, amount, signer) {
  try {
    const contractWithSigner = contract.connect(signer);
    
    const tx = await contractWithSigner.contribute({
      value: ethers.parseEther(amount)
    });
    
    const receipt = await tx.wait();
    console.log('Contribution successful:', receipt.hash);
    return receipt.hash;
  } catch (error) {
    console.error('Contribution failed:', error);
    throw error;
  }
}
```

### Check User's Contribution
```javascript
async function getUserContribution(poolAddress, userAddress) {
  try {
    const contribution = await contract.getContribution(poolAddress, userAddress);
    return ethers.formatEther(contribution);
  } catch (error) {
    console.error('Error fetching contribution:', error);
    return '0';
  }
}
```

## Best Practices

### 1. Always Handle Errors
```javascript
try {
  const result = await contract.someFunction();
} catch (error) {
  console.error('Contract call failed:', error.message);
  // Handle specific error types
}
```

### 2. Use Appropriate Network
```javascript
// For development
const provider = new ethers.JsonRpcProvider('http://localhost:8545');

// For mainnet
const provider = new ethers.JsonRpcProvider(process.env.MAINNET_RPC_URL);

// For testnet
const provider = new ethers.JsonRpcProvider(process.env.TESTNET_RPC_URL);
```

### 3. Format Numbers Properly
```javascript
// Always convert BigInt to readable format
const balance = await contract.balanceOf(address);
const formattedBalance = ethers.formatEther(balance);

// Convert user input to Wei
const userAmount = '1.5';
const amountInWei = ethers.parseEther(userAmount);
```

### 4. Use Appropriate Gas Estimation
```javascript
// Estimate gas before sending
const gasEstimate = await contract.someFunction.estimateGas(param1, param2);
const tx = await contract.someFunction(param1, param2, { gasLimit: gasEstimate });
```

### 5. Monitor Transaction Status
```javascript
const tx = await contract.someFunction();
const receipt = await tx.wait();

if (receipt.status === 1) {
  console.log('Transaction successful');
} else {
  console.log('Transaction failed');
}
```

This covers the essentials of interacting with smart contracts using ethers.js. The library provides a clean, intuitive interface for both reading and writing to blockchain contracts.