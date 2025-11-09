import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWeb3 } from '../contexts/Web3Context';
import type { Campaign } from '../types/web3';
import CountdownTimer from './CountdownTimer';

interface CampaignCardProps {
  campaign: Campaign;
  onDonate: (campaignId: string, amount: string) => Promise<void>;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onDonate }) => {
  const { address } = useAccount();
  const { walletState, contractService } = useWeb3();
  const [donationAmount, setDonationAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDonateForm, setShowDonateForm] = useState(false);
  const [userContribution, setUserContribution] = useState<string>('0');

  const progress = (parseFloat(campaign.currentAmount) / parseFloat(campaign.targetAmount)) * 100;
  // const isFinished = campaign.isFinished || false;

  // Fetch user's contribution to this campaign
  useEffect(() => {
    const fetchUserContribution = async () => {
      if (!contractService || !address) return;

      try {
        const contribution = await contractService.getContribution(campaign.address, address);
        setUserContribution(contribution);
      } catch (error) {
        console.error('Error fetching user contribution:', error);
      }
    };

    fetchUserContribution();
  }, [contractService, address, campaign.address]);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationAmount || parseFloat(donationAmount) <= 0) return;

    setIsLoading(true);
    try {
      await onDonate(campaign.id, donationAmount);
      setDonationAmount('');
      setShowDonateForm(false);
    } catch (error) {
      console.error('Donation failed:', error);
      alert('Donation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-primary-gray-dark rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/15 border border-primary-gray hover:border-accent-red">
      <div className="relative h-32 bg-gradient-to-br from-primary-gray-dark to-primary-gray overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-red/20 to-transparent"></div>
        <div className="absolute top-4 right-4">
          {campaign.isActive ? (
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg">Active</span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg">Ended</span>
          )}
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="text-white/80 text-sm font-mono">
            {campaign.address.slice(0, 6)}...{campaign.address.slice(-4)}
          </div>
          {campaign.socialLink && (
            <div className="text-white/60 text-xs mt-1 truncate max-w-32">
              {campaign.socialLink}
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 leading-tight">{campaign.title}</h3>
        <p className="text-primary-gray-light leading-relaxed mb-4 line-clamp-3">{campaign.description}</p>

        <div className="flex items-center gap-2 mb-6 p-3 bg-primary-gray-dark rounded-lg border border-primary-gray">
          <span className="text-sm text-primary-gray-light">Creator:</span>
          <span className="font-mono text-sm text-accent-red font-semibold">{formatAddress(campaign.creator)}</span>
        </div>

        <div className="mb-6">
          <div className="w-full h-2 bg-primary-gray rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-accent-red to-accent-red-dark rounded-full transition-all duration-300 relative"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold text-white">{campaign.currentAmount} ETH</span>
            <span className="text-sm text-primary-gray-light">of {campaign.targetAmount} ETH</span>
          </div>
          <div className="text-center text-sm font-semibold text-accent-red">{progress.toFixed(1)}% funded</div>
        </div>

        <div className="mb-6">
          <CountdownTimer deadline={campaign.deadline} className="mb-4" />
          <div className="flex justify-center">
            <div className="text-sm text-primary-gray-light bg-primary-gray-dark px-4 py-2 rounded-lg border border-primary-gray">
              🎯 Goal: {campaign.targetAmount} ETH
            </div>
          </div>
        </div>

        {parseFloat(userContribution) > 0 && (
          <div className="mb-4 p-3 bg-accent-red/10 rounded-lg border border-accent-red/20">
            <div className="text-sm text-accent-red font-semibold">
              Your contribution: {userContribution} ETH
            </div>
          </div>
        )}


        <div>
          {walletState.isConnected ? (
            <>
              {!showDonateForm ? (
                <div className="space-y-3">
                  <button
                    className="w-full py-3 bg-accent-red text-white rounded-xl font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-red-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-500/40 hover:bg-accent-red-dark disabled:bg-primary-gray disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                    onClick={() => setShowDonateForm(true)}
                    disabled={!campaign.isActive}
                  >
                    {campaign.isActive ? 'Fund This Project' : 'Campaign Ended'}
                  </button>

                  {campaign.creator.toLowerCase() === walletState.account?.toLowerCase() && (
                    <div className="flex gap-2">
                      <button
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={async () => {
                          if (!contractService) return;
                          try {
                            const canWithdraw = await contractService.canWithdraw(campaign.address, campaign.creator);
                            if (canWithdraw) {
                              const txHash = await contractService.withdrawFromPool(campaign.address);
                              alert(`Withdrawal successful! Transaction hash: ${txHash}`);
                            } else {
                              alert('Cannot withdraw yet. Goal not met.');
                            }
                          } catch (error) {
                            console.error('Withdrawal failed:', error);
                            alert('Withdrawal failed. Please try again.');
                          }
                        }}
                      >
                        Withdraw
                      </button>

                      <button
                        className="flex-1 py-2 bg-yellow-600 text-white rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={async () => {
                          if (!contractService) return;
                          try {
                            const canRefund = await contractService.canRefund(campaign.address);
                            if (canRefund) {
                              const txHash = await contractService.refundFromPool(campaign.address);
                              alert(`Refund successful! Transaction hash: ${txHash}`);
                            } else {
                              alert('Cannot refund yet. Campaign may still be active or goal was met.');
                            }
                          } catch (error) {
                            console.error('Refund failed:', error);
                            alert('Refund failed. Please try again.');
                          }
                        }}
                      >
                        Refund
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <form className="flex flex-col gap-4" onSubmit={handleDonate}>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      placeholder="Amount in ETH"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="w-full py-3 px-4 pr-16 bg-primary-gray-dark border-2 border-primary-gray rounded-xl text-white placeholder-primary-gray-light focus:outline-none focus:border-accent-red focus:ring-2 focus:ring-red-500/10 transition-colors"
                      required
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-gray-light font-semibold pointer-events-none">ETH</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-accent-red text-white rounded-xl font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-red-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-500/40 hover:bg-accent-red-dark disabled:bg-primary-gray disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                      disabled={isLoading || !donationAmount}
                    >
                      {isLoading ? 'Processing...' : 'Confirm Donation'}
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 bg-transparent text-primary-gray-light border-2 border-primary-gray rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:bg-primary-gray-dark hover:border-primary-gray"
                      onClick={() => {
                        setShowDonateForm(false);
                        setDonationAmount('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <button className="w-full py-3 bg-primary-gray text-primary-gray-light rounded-xl font-semibold cursor-not-allowed" disabled>
              Connect Wallet to Fund
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;