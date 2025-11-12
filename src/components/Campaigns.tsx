import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import CampaignCard from './CampaignCard';
import type { Campaign } from '../types/web3';

const Campaigns: React.FC = () => {
  const { contractService } = useWeb3();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'progress' | 'deadline'>('newest');
  const [loading, setLoading] = useState(true);

  // Helper function for fallback campaigns
  const getFallbackCampaigns = (): Campaign[] => {
    return [
      {
        id: 'demo-1',
        title: 'DeFi Trading Bot Revolution',
        description: 'Building an AI-powered trading bot that uses machine learning to optimize DeFi yield farming strategies across multiple protocols.',
        address: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
        targetAmount: '50.0',
        currentAmount: '32.5',
        creator: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop'
      },
      {
        id: 'demo-2',
        title: 'NFT Marketplace for Digital Art',
        description: 'Creating a next-generation NFT marketplace with zero gas fees, advanced royalty systems, and creator-friendly features.',
        address: '0x8ba1f109551bD432803012645Hac189451b957',
        targetAmount: '75.0',
        currentAmount: '45.8',
        creator: '0x8ba1f109551bD432803012645Hac189451b957',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        isActive: true,
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=200&fit=crop'
      },
      {
        id: 'demo-3',
        title: 'Blockchain Gaming Platform',
        description: 'Developing a play-to-earn gaming ecosystem where players can earn crypto rewards through skill-based gameplay.',
        address: '0x9f2d35Cc6634C0532925a3b8D4C0532925a3b8D4',
        targetAmount: '100.0',
        currentAmount: '78.2',
        creator: '0x9f2d35Cc6634C0532925a3b8D4C0532925a3b8D4',
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true,
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop'
      }
    ];
  };

  // Fetch campaigns from contract
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      console.log('🔄 Starting campaign fetch...');
      
      if (!contractService) {
        console.log('⚠️ Contract service not available - using fallback campaigns');
        setCampaigns(getFallbackCampaigns());
        setLoading(false);
        return;
      }

      try {
        console.log('📡 Attempting to fetch campaigns from blockchain...');
        const poolAddresses = await contractService.getAllPools();
        console.log(`✅ Found ${poolAddresses.length} pools on blockchain`);

        if (poolAddresses.length === 0) {
          console.log('📋 No pools found on blockchain - showing demo campaigns');
          setCampaigns(getFallbackCampaigns());
        } else {
          console.log('📊 Processing pool details...');
          const campaignPromises = poolAddresses.map(async (address) => {
            try {
              const poolDetails = await contractService.getPoolDetails(address);
              console.log(`✅ Processed pool ${address}: ${poolDetails.purpose}`);
              
              return {
                id: address.slice(-8),
                address: poolDetails.address,
                creator: poolDetails.owner,
                title: poolDetails.purpose || `Funding Pool ${address.slice(-8)}`,
                description: `Decentralized funding pool created by ${poolDetails.owner.slice(0, 6)}...${poolDetails.owner.slice(-4)}. Target: ${poolDetails.goal} ETH.`,
                targetAmount: poolDetails.goal,
                currentAmount: poolDetails.totalContributed,
                deadline: poolDetails.deadline,
                isActive: !poolDetails.isFinished,
                isFinished: poolDetails.isFinished,
                socialLink: poolDetails.socialLink || undefined,
                imageUrl: poolDetails.imageUrl
              } as Campaign;
            } catch (poolError) {
              console.warn(`❌ Failed to fetch details for pool ${address}:`, poolError);
              return null;
            }
          });

          const campaignsData = (await Promise.all(campaignPromises)).filter(Boolean) as Campaign[];
          console.log(`✅ Successfully loaded ${campaignsData.length} campaigns`);
          setCampaigns(campaignsData);
        }
      } catch (error) {
        console.error('❌ Error fetching campaigns from blockchain:', error);
        console.log('🔄 Falling back to demo campaigns...');
        setCampaigns(getFallbackCampaigns());
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [contractService]);

  const handleDonate = async (campaignId: string, amount: string) => {
    // Check if user is connected and has contract service
    if (!contractService) {
      alert('Please connect your wallet to donate to campaigns.');
      return;
    }

    try {
      // Find the campaign to get its contract address
      const campaign = campaigns.find(c => c.id === campaignId);
      if (!campaign) {
        alert('Campaign not found');
        return;
      }

      const txHash = await contractService.contributeToPool(campaign.address, amount);
      console.log('Donation successful:', txHash);

      // Update the campaign's current amount
      setCampaigns(prev => prev.map(campaign =>
        campaign.id === campaignId
          ? { ...campaign, currentAmount: (parseFloat(campaign.currentAmount) + parseFloat(amount)).toString() }
          : campaign
      ));

      alert(`Donation successful! Transaction hash: ${txHash}`);
    } catch (error) {
      console.error('Donation failed:', error);
      alert(`Donation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (filter === 'active') return campaign.isActive;
    if (filter === 'ended') return !campaign.isActive;
    return true;
  });

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    switch (sortBy) {
      case 'progress':
        const progressA = (parseFloat(a.currentAmount) / parseFloat(a.targetAmount)) * 100;
        const progressB = (parseFloat(b.currentAmount) / parseFloat(b.targetAmount)) * 100;
        return progressB - progressA;
      case 'deadline':
        return a.deadline.getTime() - b.deadline.getTime();
      case 'newest':
      default:
        return b.deadline.getTime() - a.deadline.getTime();
    }
  });

  return (
    <section className="py-16 min-h-screen">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 text-white">Funding Campaigns</h1>
          <p className="text-xl text-white max-w-2xl mx-auto">Discover and support innovative crypto projects that are shaping the future</p>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 p-6 bg-black rounded-xl border-2 border-white">
          <div className="flex gap-2 mb-4 lg:mb-0">
            <button
              className={`px-4 py-2 border-2 border-white rounded-lg cursor-pointer transition-all duration-300 font-medium hover:bg-white hover:text-black ${filter === 'all' ? 'bg-white text-black' : 'text-white bg-black'}`}
              onClick={() => setFilter('all')}
            >
              All Campaigns
            </button>
            <button
              className={`px-4 py-2 border-2 border-white rounded-lg cursor-pointer transition-all duration-300 font-medium hover:bg-white hover:text-black ${filter === 'active' ? 'bg-white text-black' : 'text-white bg-black'}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`px-4 py-2 border-2 border-white rounded-lg cursor-pointer transition-all duration-300 font-medium hover:bg-white hover:text-black ${filter === 'ended' ? 'bg-white text-black' : 'text-white bg-black'}`}
              onClick={() => setFilter('ended')}
            >
              Ended
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-black border-2 border-white text-white rounded-lg cursor-pointer transition-colors duration-200 focus:outline-none focus:bg-white focus:text-black"
            >
              <option value="newest">Newest First</option>
              <option value="progress">Most Funded</option>
              <option value="deadline">Ending Soon</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-primary-white">Loading campaigns...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
              {sortedCampaigns.map(campaign => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onDonate={handleDonate}
                />
              ))}
            </div>

            {sortedCampaigns.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border-2 border-black">
                <h3 className="text-2xl text-black mb-4">No campaigns found</h3>
                <p className="text-black">Try adjusting your filters to see more campaigns.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Campaigns;