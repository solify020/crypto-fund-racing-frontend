import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header: React.FC = () => {
  const location = useLocation();

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
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Header;