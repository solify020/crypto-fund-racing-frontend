import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import type { Campaign } from '../types/web3';
import CountdownTimer from './CountdownTimer';

interface CampaignCardProps {
  campaign: Campaign;
  onDonate: (campaignId: string, amount: string) => Promise<void>;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onDonate }) => {
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
      if (!contractService || !walletState.account) return;

      try {
        const contribution = await contractService.getContribution(campaign.address, walletState.account);
        setUserContribution(contribution);
      } catch (error) {
        console.error('Error fetching user contribution:', error);
        // Don't show error to user, just continue without contribution info
      }
    };

    fetchUserContribution();
  }, [contractService, walletState.account, campaign.address]);

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

  // const formatAddress = (address: string) => {
  //   return `${address.slice(0, 6)}...${address.slice(-4)}`;
  // };

  return (
    <div className="bg-black rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/30 border-2 border-white">
      <div className={`relative h-32 ${campaign.imageUrl ? 'bg-cover bg-center' : 'bg-white/10'} overflow-hidden`} style={campaign.imageUrl ? {backgroundImage: `url(${campaign.imageUrl})`} : {}}>
        <div className="absolute top-4 right-4">
          {campaign.isActive ? (
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-white text-black shadow-lg">Active</span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-black text-white shadow-lg border border-white">Ended</span>
          )}
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="text-white text-xl font-mono drop-shadow-lg">
            {campaign.title}
          </div>
          {campaign.socialLink && (
            <div className="text-white/90 text-xs mt-1 truncate max-w-32 drop-shadow">
              <a href={campaign.socialLink} className="text-white hover:text-white/80 underline" target="_blank" rel="noopener noreferrer">
                {campaign.socialLink}
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 leading-tight">Funding Progress</h3>

        <div className="mb-6">
          <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden mb-3 border border-white/30">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold text-white">{campaign.currentAmount} ETH</span>
            <span className="text-sm text-white">of {campaign.targetAmount} ETH</span>
          </div>
          <div className="text-center text-sm font-semibold text-white">{progress.toFixed(1)}% funded</div>
        </div>

        <div className="mb-6">
          {
            campaign.isActive ? (
              <CountdownTimer deadline={campaign.deadline} className="mb-4" />
            ) : (
              <div className="text-center text-xl font-semibold text-white">Ended!</div>
            )
          }
          <div className="flex justify-center">
            <div className="text-sm text-white bg-black px-4 py-2 rounded-lg border border-white">
              🎯 Goal: {campaign.targetAmount} ETH
            </div>
          </div>
        </div>

        {parseFloat(userContribution) > 0 && (
          <div className="mb-4 p-3 bg-white/10 rounded-lg border border-white/20">
            <div className="text-sm text-white font-semibold">
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
                    className="w-full py-3 bg-white text-black rounded-xl font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-white/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/40 disabled:bg-black disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none disabled:text-white disabled:border disabled:border-white"
                    onClick={() => setShowDonateForm(true)}
                    disabled={!campaign.isActive}
                  >
                    {campaign.isActive ? 'Fund This Project' : 'Campaign Ended'}
                  </button>

                  {campaign.creator.toLowerCase() === walletState.account?.toLowerCase() && !campaign.isFinished && (
                    <div className="flex gap-2">
                      <button
                        className="flex-1 py-2 bg-white text-black rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={async () => {
                          if (!contractService) return;
                          try {
                            const canWithdraw = await contractService.canWithdraw(campaign.address, campaign.creator);
                            if (canWithdraw) {
                              const txHash = await contractService.withdrawFromPool(campaign.address);
                              alert(`Withdrawal successful! Pool is now ended. Transaction hash: ${txHash}`);
                              window.location.reload();
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
                        className="flex-1 py-2 bg-black text-white rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed border border-white"
                        onClick={async () => {
                          if (!contractService) return;
                          try {
                            const canRefund = await contractService.canRefund(campaign.address);
                            if (canRefund) {
                              const txHash = await contractService.refundFromPool(campaign.address);
                              alert(`Refund successful! Pool is now ended. Transaction hash: ${txHash}`);
                              window.location.reload();
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
                      className="w-full py-3 px-4 pr-16 bg-black border-2 border-white rounded-xl text-white placeholder-white focus:outline-none focus:bg-white focus:text-black focus:ring-2 focus:ring-white/10 transition-colors"
                      required
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white font-semibold pointer-events-none">ETH</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-white text-black rounded-xl font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-white/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/40 disabled:bg-black disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none disabled:text-white disabled:border disabled:border-white"
                      disabled={isLoading || !donationAmount}
                    >
                      {isLoading ? 'Processing...' : 'Confirm Donation'}
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 bg-transparent text-white border-2 border-white rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:bg-white hover:text-black"
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
            <button className="w-full py-3 bg-black text-white rounded-xl font-semibold cursor-not-allowed border-2 border-white" disabled>
              Connect Wallet to Fund
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;