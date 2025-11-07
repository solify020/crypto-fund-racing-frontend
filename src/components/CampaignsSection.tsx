import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import CampaignCard from './CampaignCard';
import type { Campaign } from '../types/web3';

const CampaignsSection: React.FC = () => {
  const { sendTransaction } = useWeb3();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'progress' | 'deadline'>('newest');

  // Mock data for demonstration - in a real app, this would come from a smart contract or API
  useEffect(() => {
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        title: 'DeFi Trading Bot Revolution',
        description: 'Building an AI-powered trading bot that uses machine learning to optimize DeFi yield farming strategies across multiple protocols.',
        address: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
        targetAmount: '50.0',
        currentAmount: '32.5',
        creator: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isActive: true,
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop'
      },
      {
        id: '2',
        title: 'NFT Marketplace for Digital Art',
        description: 'Creating a next-generation NFT marketplace with zero gas fees, advanced royalty systems, and creator-friendly features.',
        address: '0x8ba1f109551bD432803012645Hac189451b957',
        targetAmount: '75.0',
        currentAmount: '45.8',
        creator: '0x8ba1f109551bD432803012645Hac189451b957',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        isActive: true,
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=200&fit=crop'
      },
      {
        id: '3',
        title: 'Blockchain Gaming Platform',
        description: 'Developing a play-to-earn gaming ecosystem where players can earn crypto rewards through skill-based gameplay.',
        address: '0x9f2d35Cc6634C0532925a3b8D4C0532925a3b8D4',
        targetAmount: '100.0',
        currentAmount: '78.2',
        creator: '0x9f2d35Cc6634C0532925a3b8D4C0532925a3b8D4',
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        isActive: true,
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop'
      },
      {
        id: '4',
        title: 'Green Energy Crypto Mining',
        description: 'Sustainable cryptocurrency mining operation powered entirely by renewable energy sources.',
        address: '0x1a2b35Cc6634C0532925a3b8D4C0532925a3b8D4',
        targetAmount: '200.0',
        currentAmount: '156.7',
        creator: '0x1a2b35Cc6634C0532925a3b8D4C0532925a3b8D4',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        isActive: true,
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=200&fit=crop'
      },
      {
        id: '5',
        title: 'Decentralized Social Network',
        description: 'Building a censorship-resistant social media platform where users own their data and earn tokens for quality content.',
        address: '0x3c4d35Cc6634C0532925a3b8D4C0532925a3b8D4',
        targetAmount: '80.0',
        currentAmount: '80.0',
        creator: '0x3c4d35Cc6634C0532925a3b8D4C0532925a3b8D4',
        deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (ended)
        isActive: false,
        image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop'
      },
      {
        id: '6',
        title: 'Crypto Education Platform',
        description: 'Interactive learning platform teaching blockchain development, smart contracts, and DeFi protocols through hands-on projects.',
        address: '0x5e6f35Cc6634C0532925a3b8D4C0532925a3b8D4',
        targetAmount: '25.0',
        currentAmount: '18.3',
        creator: '0x5e6f35Cc6634C0532925a3b8D4C0532925a3b8D4',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        isActive: true,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop'
      }
    ];
    setCampaigns(mockCampaigns);
  }, []);

  const handleDonate = async (campaignId: string, amount: string) => {
    try {
      // In a real application, this would be the campaign's smart contract address
      const campaignAddress = '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4';
      
      const txHash = await sendTransaction(campaignAddress, amount);
      console.log('Donation successful:', txHash);
      
      // Update the campaign's current amount (in a real app, this would be fetched from the blockchain)
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
    <section id="campaigns" className="py-20 bg-primary-black border-t-2 border-accent-red">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-4 text-gradient">Active Funding Campaigns</h2>
          <p className="text-xl text-primary-gray-light max-w-2xl mx-auto leading-relaxed">Discover and support innovative crypto projects that are shaping the future</p>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex gap-2 bg-primary-gray-dark p-2 rounded-xl shadow-lg border border-primary-gray">
            <button
              className={`px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 ${filter === 'all' ? 'bg-accent-red text-white shadow-lg shadow-red-500/30' : 'bg-transparent text-gray-400 hover:bg-primary-gray hover:text-white'}`}
              onClick={() => setFilter('all')}
            >
              All Campaigns
            </button>
            <button
              className={`px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 ${filter === 'active' ? 'bg-accent-red text-white shadow-lg shadow-red-500/30' : 'bg-transparent text-gray-400 hover:bg-primary-gray hover:text-white'}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 ${filter === 'ended' ? 'bg-accent-red text-white shadow-lg shadow-red-500/30' : 'bg-transparent text-gray-400 hover:bg-primary-gray hover:text-white'}`}
              onClick={() => setFilter('ended')}
            >
              Ended
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border-2 border-primary-gray rounded-lg bg-primary-gray-dark text-white font-medium cursor-pointer transition-colors duration-200 focus:outline-none focus:border-accent-red"
            >
              <option value="newest">Newest First</option>
              <option value="progress">Most Funded</option>
              <option value="deadline">Ending Soon</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {sortedCampaigns.map(campaign => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onDonate={handleDonate}
            />
          ))}
        </div>

        {sortedCampaigns.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <h3 className="text-2xl text-gray-700 mb-2">No campaigns found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more campaigns.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CampaignsSection;