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

  // Fetch campaigns from contract
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!contractService) {
        setLoading(false);
        return;
      }

      try {
        const poolAddresses = await contractService.getAllPools();

        const campaignPromises = poolAddresses.map(async (address) => {
          const poolDetails = await contractService.getPoolDetails(address);

          const currentTime = Date.now();
          const isActive = poolDetails.deadline.getTime() > currentTime;

          return {
            id: address.slice(-8), // Use last 8 characters of address as ID
            address: poolDetails.address,
            title: `Funding Pool ${address.slice(-8)}`, // Simple title based on address
            description: `Decentralized funding pool created by ${poolDetails.owner.slice(0, 6)}...${poolDetails.owner.slice(-4)}. Target: ${poolDetails.goal} ETH.`,
            targetAmount: poolDetails.goal,
            currentAmount: poolDetails.totalContributed,
            deadline: poolDetails.deadline,
            isActive,
            isFinished: poolDetails.isFinished,
            socialLink: poolDetails.socialLink || undefined
          } as Campaign;
        });

        const campaignsData = await Promise.all(campaignPromises);
        setCampaigns(campaignsData);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        // Fallback to mock data if contract fails
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [contractService]);

  const handleDonate = async (campaignId: string, amount: string) => {
    if (!contractService) {
      throw new Error('Contract service not available');
    }

    try {
      // Find the campaign to get its contract address
      const campaign = campaigns.find(c => c.id === campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
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
      throw error;
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
          <h1 className="text-5xl font-extrabold mb-4 text-gradient">Funding Campaigns</h1>
          <p className="text-xl text-primary-gray-light max-w-2xl mx-auto">Discover and support innovative crypto projects that are shaping the future</p>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 p-6 bg-white/5 rounded-xl border border-white/10">
          <div className="flex gap-2 mb-4 lg:mb-0">
            <button
              className={`px-4 py-2 border border-primary-gray text-primary-gray-light rounded-lg cursor-pointer transition-all duration-300 font-medium hover:border-accent-red hover:text-white ${filter === 'all' ? 'bg-accent-red border-accent-red text-white' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Campaigns
            </button>
            <button
              className={`px-4 py-2 border border-primary-gray text-primary-gray-light rounded-lg cursor-pointer transition-all duration-300 font-medium hover:border-accent-red hover:text-white ${filter === 'active' ? 'bg-accent-red border-accent-red text-white' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`px-4 py-2 border border-primary-gray text-primary-gray-light rounded-lg cursor-pointer transition-all duration-300 font-medium hover:border-accent-red hover:text-white ${filter === 'ended' ? 'bg-accent-red border-accent-red text-white' : ''}`}
              onClick={() => setFilter('ended')}
            >
              Ended
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-white/5 border border-primary-gray text-white rounded-lg cursor-pointer transition-colors duration-200 focus:outline-none focus:border-accent-red"
            >
              <option value="newest">Newest First</option>
              <option value="progress">Most Funded</option>
              <option value="deadline">Ending Soon</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-accent-red border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-primary-gray-light">Loading campaigns...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-16">
              {sortedCampaigns.map(campaign => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onDonate={handleDonate}
                />
              ))}
            </div>

            {sortedCampaigns.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-2xl text-primary-gray-light mb-4">No campaigns found</h3>
                <p className="text-primary-gray">Try adjusting your filters to see more campaigns.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Campaigns;