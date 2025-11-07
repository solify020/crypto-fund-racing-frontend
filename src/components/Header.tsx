import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';

const Header: React.FC = () => {
  const { walletState, connectWallet, disconnectWallet } = useWeb3();
  const location = useLocation();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string) => {
    return parseFloat(balance).toFixed(4);
  };

  return (
    <header className="bg-primary-black py-4 shadow-lg sticky top-0 z-50 border-b-2 border-accent-red">
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center flex-wrap gap-4 md:flex-col md:text-center">
        <div className="logo">
          <h1 className="text-white m-0 text-2xl font-bold flex items-center gap-2">🚀 CryptoFund Racing</h1>
          <span className="text-white/80 text-sm font-normal block mt-1">Fuel Innovation with Crypto</span>
        </div>

        <nav className="nav flex gap-8 items-center md:order-3 md:w-full md:justify-center md:mt-4 sm:gap-4">
          <Link to="/" className={`text-white no-underline font-medium transition-colors duration-300 relative nav-link ${location.pathname === '/' ? 'text-accent-red' : 'hover:text-accent-red'}`}>Home</Link>
          <Link to="/campaigns" className={`text-white no-underline font-medium transition-colors duration-300 relative nav-link ${location.pathname === '/campaigns' ? 'text-accent-red' : 'hover:text-accent-red'}`}>Campaigns</Link>
          <Link to="/create-campaign" className={`text-white no-underline font-medium transition-colors duration-300 relative nav-link ${location.pathname === '/create-campaign' ? 'text-accent-red' : 'hover:text-accent-red'}`}>Create Campaign</Link>
          <Link to="/how-it-works" className={`text-white no-underline font-medium transition-colors duration-300 relative nav-link ${location.pathname === '/how-it-works' ? 'text-accent-red' : 'hover:text-accent-red'}`}>How It Works</Link>
          <Link to="/about" className={`text-white no-underline font-medium transition-colors duration-300 relative nav-link ${location.pathname === '/about' ? 'text-accent-red' : 'hover:text-accent-red'}`}>About</Link>
        </nav>

        <div className="wallet-section flex items-center md:order-2">
          {walletState.isConnected ? (
            <div className="wallet-info flex items-center gap-4 bg-primary-gray-dark p-2 rounded-xl border border-primary-gray sm:flex-col sm:gap-2">
              <div className="wallet-details flex flex-col items-end sm:items-center">
                <span className="address text-white font-semibold text-sm">{formatAddress(walletState.account!)}</span>
                <span className="balance text-accent-red text-xs font-medium">{formatBalance(walletState.balance)} ETH</span>
              </div>
              <button
                className="disconnect-btn bg-primary-gray text-primary-white border-none py-3 px-6 rounded-full font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-gray-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gray-500/40 hover:bg-primary-gray-dark"
                onClick={disconnectWallet}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              className="connect-btn bg-accent-red text-primary-white border-none py-3 px-6 rounded-full font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-red-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-500/40 hover:bg-accent-red-dark disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
              onClick={connectWallet}
              disabled={walletState.isConnecting}
            >
              {walletState.isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;