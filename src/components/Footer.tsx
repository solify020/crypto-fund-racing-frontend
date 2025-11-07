import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-black text-white py-12 mt-auto border-t-2 border-accent-red">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-gradient">🚀 CryptoFund Racing</h3>
            <p className="text-primary-gray-light leading-relaxed mb-6 text-sm">
              Accelerating innovation through decentralized funding.
              Join the future of crypto-powered project financing.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-primary-gray-dark rounded-full flex items-center justify-center no-underline transition-all duration-300 hover:bg-accent-red hover:-translate-y-1 border border-primary-gray" aria-label="Twitter">
                <span className="text-lg">🐦</span>
              </a>
              <a href="#" className="w-10 h-10 bg-primary-gray-dark rounded-full flex items-center justify-center no-underline transition-all duration-300 hover:bg-accent-red hover:-translate-y-1 border border-primary-gray" aria-label="Discord">
                <span className="text-lg">💬</span>
              </a>
              <a href="#" className="w-10 h-10 bg-primary-gray-dark rounded-full flex items-center justify-center no-underline transition-all duration-300 hover:bg-accent-red hover:-translate-y-1 border border-primary-gray" aria-label="Telegram">
                <span className="text-lg">✈️</span>
              </a>
              <a href="#" className="w-10 h-10 bg-primary-gray-dark rounded-full flex items-center justify-center no-underline transition-all duration-300 hover:bg-accent-red hover:-translate-y-1 border border-primary-gray" aria-label="GitHub">
                <span className="text-lg">🐙</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-accent-red font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#campaigns" className="text-primary-gray-light no-underline text-sm hover:text-accent-red transition-colors duration-300">Browse Campaigns</a></li>
              <li><a href="#create" className="text-primary-gray-light no-underline text-sm hover:text-accent-red transition-colors duration-300">Create Campaign</a></li>
              <li><a href="#how-it-works" className="text-primary-gray-light no-underline text-sm hover:text-accent-red transition-colors duration-300">How It Works</a></li>
              <li><a href="#fees" className="text-primary-gray-light no-underline text-sm hover:text-accent-red transition-colors duration-300">Fees & Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-accent-red font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#docs" className="text-primary-gray-light no-underline text-sm hover:text-accent-red transition-colors duration-300">Documentation</a></li>
              <li><a href="#api" className="text-primary-gray-light no-underline text-sm hover:text-accent-red transition-colors duration-300">API Reference</a></li>
              <li><a href="#tutorials" className="text-primary-gray-light no-underline text-sm hover:text-accent-red transition-colors duration-300">Tutorials</a></li>
              <li><a href="#blog" className="text-primary-gray-light no-underline text-sm hover:text-accent-red transition-colors duration-300">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-accent-red font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#help" className="text-primary-gray-light no-underline text-sm hover:text-accent-red transition-colors duration-300">Help Center</a></li>
              <li><a href="#contact" className="text-primary-gray-light no-underline text-sm hover:text-accent-red transition-colors duration-300">Contact Us</a></li>
              <li><a href="#security" className="text-primary-gray-light no-underline text-sm hover:text-accent-red transition-colors duration-300">Security</a></li>
              <li><a href="#status" className="text-primary-gray-light no-underline text-sm hover:text-accent-red transition-colors duration-300">Status Page</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-accent-red font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#privacy" className="text-primary-gray-light no-underline text-sm hover:text-accent-red transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="#terms" className="text-primary-gray-light no-underline text-sm hover:text-accent-red transition-colors duration-300">Terms of Service</a></li>
              <li><a href="#cookies" className="text-primary-gray-light no-underline text-sm hover:text-accent-red transition-colors duration-300">Cookie Policy</a></li>
              <li><a href="#compliance" className="text-primary-gray-light no-underline text-sm hover:text-accent-red transition-colors duration-300">Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-primary-gray border-b border-primary-gray mb-8">
          <div className="text-center p-4 bg-primary-gray-dark rounded-xl border border-primary-gray">
            <span className="block text-2xl font-bold text-accent-red mb-1">$2.5M+</span>
            <span className="text-xs text-primary-gray-light uppercase tracking-wide">Total Funded</span>
          </div>
          <div className="text-center p-4 bg-primary-gray-dark rounded-xl border border-primary-gray">
            <span className="block text-2xl font-bold text-accent-red mb-1">150+</span>
            <span className="text-xs text-primary-gray-light uppercase tracking-wide">Projects</span>
          </div>
          <div className="text-center p-4 bg-primary-gray-dark rounded-xl border border-primary-gray">
            <span className="block text-2xl font-bold text-accent-red mb-1">5K+</span>
            <span className="text-xs text-primary-gray-light uppercase tracking-wide">Backers</span>
          </div>
          <div className="text-center p-4 bg-primary-gray-dark rounded-xl border border-primary-gray">
            <span className="block text-2xl font-bold text-accent-red mb-1">98%</span>
            <span className="text-xs text-primary-gray-light uppercase tracking-wide">Success Rate</span>
          </div>
        </div>

        <div className="border-t border-primary-gray pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-gray-light text-sm m-0">
              © 2024 CryptoFund Racing. All rights reserved.
            </p>
            <div className="flex items-center">
              <span className="flex items-center gap-2 px-4 py-2 bg-primary-gray-dark rounded-full text-sm font-medium text-primary-gray-light border border-primary-gray">
                <span className="w-2 h-2 bg-accent-red rounded-full animate-pulse"></span>
                Ethereum Network
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;