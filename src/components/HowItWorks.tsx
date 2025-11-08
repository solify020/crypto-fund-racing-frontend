import React from 'react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: "Connect Your Wallet",
      description: "Link your MetaMask or compatible Web3 wallet to access the platform securely.",
      icon: "🔗"
    },
    {
      step: 2,
      title: "Browse Campaigns",
      description: "Explore active crypto fund campaigns and review their performance metrics.",
      icon: "📊"
    },
    {
      step: 3,
      title: "Make Your Investment",
      description: "Choose your preferred campaign and invest using ETH or compatible tokens.",
      icon: "💰"
    },
    {
      step: 4,
      title: "Track Performance",
      description: "Monitor your investments in real-time and track fund performance.",
      icon: "📈"
    },
    {
      step: 5,
      title: "Withdraw Profits",
      description: "Cash out your earnings when campaigns complete or reach milestones.",
      icon: "🏆"
    }
  ];

  return (
    <section className="min-h-screen bg-primary-black text-white py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 text-gradient">How It Works</h1>
          <p className="text-xl text-primary-gray-light max-w-2xl mx-auto leading-relaxed">
            Get started with crypto fund racing in just 5 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-20">
          {steps.map((step) => (
            <div key={step.step} className="relative bg-primary-gray-dark rounded-2xl p-6 text-center border border-primary-gray transition-all duration-300 hover:-translate-y-2 hover:border-accent-red hover:shadow-xl hover:shadow-red-500/10">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent-red text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg shadow-red-500/30">{step.step}</div>
              <div className="text-5xl mb-4 mt-4">{step.icon}</div>
              <h3 className="text-lg font-bold mb-3 text-white">{step.title}</h3>
              <p className="text-primary-gray-light leading-relaxed text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-primary-gray-dark rounded-xl p-6 text-center border border-primary-gray transition-all duration-300 hover:-translate-y-1 hover:border-accent-red hover:shadow-lg hover:shadow-red-500/10">
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="text-lg font-semibold mb-3 text-white">Secure Transactions</h4>
              <p className="text-primary-gray-light leading-relaxed text-sm">All investments are secured by smart contracts on the blockchain</p>
            </div>
            <div className="bg-primary-gray-dark rounded-xl p-6 text-center border border-primary-gray transition-all duration-300 hover:-translate-y-1 hover:border-accent-red hover:shadow-lg hover:shadow-red-500/10">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-lg font-semibold mb-3 text-white">Real-time Updates</h4>
              <p className="text-primary-gray-light leading-relaxed text-sm">Live tracking of fund performance and investment returns</p>
            </div>
            <div className="bg-primary-gray-dark rounded-xl p-6 text-center border border-primary-gray transition-all duration-300 hover:-translate-y-1 hover:border-accent-red hover:shadow-lg hover:shadow-red-500/10">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-lg font-semibold mb-3 text-white">Expert Management</h4>
              <p className="text-primary-gray-light leading-relaxed text-sm">Professional fund managers with proven crypto trading strategies</p>
            </div>
            <div className="bg-primary-gray-dark rounded-xl p-6 text-center border border-primary-gray transition-all duration-300 hover:-translate-y-1 hover:border-accent-red hover:shadow-lg hover:shadow-red-500/10">
              <div className="text-4xl mb-4">📱</div>
              <h4 className="text-lg font-semibold mb-3 text-white">Mobile Friendly</h4>
              <p className="text-primary-gray-light leading-relaxed text-sm">Access your investments anywhere with our responsive design</p>
            </div>
          </div>
        </div>

        <div className="text-center bg-primary-gray-dark rounded-2xl p-12 border border-primary-gray">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Start Racing?</h2>
          <p className="text-xl text-primary-gray-light mb-8 max-w-2xl mx-auto">Join thousands of investors already profiting from crypto fund racing</p>
          <button className="bg-accent-red text-white border-none py-4 px-8 rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-red-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-500/40 hover:bg-accent-red-dark">Get Started Now</button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;