import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';

const Hero: React.FC = () => {
  const { walletState, connectWallet } = useWeb3();

  // const scrollToCampaigns = () => {
  //   const campaignsSection = document.getElementById('campaigns');
  //   if (campaignsSection) {
  //     campaignsSection.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  return (
    <section className="min-h-screen relative flex items-center overflow-hidden bg-primary-black border-b-4 border-accent-red">
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <div className="absolute w-full h-full bg-gradient-to-br from-primary-gray-light/20 via-transparent to-accent-red/10 bg-[size:200px_200px] animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-20">
        <div className="text-white">
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            <span className="text-gradient">Accelerate Innovation</span>
            <br />
            with Crypto Funding
          </h1>

          <p className="text-xl lg:text-2xl leading-relaxed mb-8 text-white/90">
            Join the future of decentralized funding. Support groundbreaking projects,
            invest in tomorrow's technology, and be part of the crypto revolution.
          </p>

          <div className="flex flex-wrap gap-8 mb-10">
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <span className="text-3xl font-bold text-accent-red mb-2">$2.5M+</span>
              <span className="text-sm text-white/80">Total Funded</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <span className="text-3xl font-bold text-accent-red mb-2">150+</span>
              <span className="text-sm text-white/80">Projects</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <span className="text-3xl font-bold text-accent-red mb-2">5K+</span>
              <span className="text-sm text-white/80">Backers</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
            {walletState.isConnected ? (
              <a href="/campaigns" className="btn">
                Explore Campaigns
              </a>
            ) : (
              <button
                className="btn disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                onClick={connectWallet}
                disabled={walletState.isConnecting}
              >
                {walletState.isConnecting ? 'Connecting...' : 'Connect & Start Funding'}
              </button>
            )}
            <a href="/campaigns" className="px-6 py-3 bg-transparent text-white border-2 border-white/30 rounded-full font-semibold cursor-pointer transition-all duration-300 hover:bg-primary-gray-dark hover:border-primary-gray hover:-translate-y-1 text-center">
              Browse Projects
            </a>
          </div>
        </div>

        <div className="flex justify-center items-center relative">
          <div className="relative w-80 h-80">
            <div className="absolute top-1/4 left-1/10 text-5xl text-orange-500 animate-bounce">₿</div>
            <div className="absolute top-3/5 right-1/5 text-5xl text-blue-500 animate-bounce" style={{animationDelay: '1.3s'}}>Ξ</div>
            <div className="absolute bottom-1/4 left-1/3 text-5xl text-green-400 animate-bounce" style={{animationDelay: '2.6s'}}>◊</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-7xl animate-pulse">🚀</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <a href="/campaigns" className="w-14 h-14 rounded-full bg-primary-gray-dark flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-primary-gray hover:-translate-y-1 border border-primary-gray">
          <span className="text-white text-2xl animate-bounce">↓</span>
        </a>
      </div>
    </section>
  );
};

export default Hero;