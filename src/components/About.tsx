import React from 'react';

const About: React.FC = () => {
  const stats = [
    { number: "10K+", label: "Active Investors" },
    { number: "$50M+", label: "Funds Managed" },
    { number: "500+", label: "Successful Campaigns" },
    { number: "99.9%", label: "Uptime" }
  ];

  const team = [
    {
      name: "Nathalie S",
      role: "CEO & Founder",
      bio: "Former hedge fund manager with 15+ years in traditional finance, now pioneering crypto fund racing.",
      image: "👨‍💼"
    },
    {
      name: "Hasegawa Heaven",
      role: "CTO",
      bio: "Blockchain expert and former lead developer at major DeFi protocols.",
      image: "👩‍💻"
    }
  ];

  return (
    <section className="min-h-screen bg-primary-black text-white py-20">
      <div className="container">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-extrabold mb-4 text-gradient">About Crypto Fund Racing</h1>
          <p className="text-xl text-primary-gray-light max-w-3xl mx-auto leading-relaxed">
            Revolutionizing investment through blockchain technology and expert fund management
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-white">Our Mission</h2>
            <p className="text-lg text-primary-gray-light leading-relaxed">
              To democratize access to professional-grade investment strategies through blockchain technology,
              enabling everyday investors to participate in sophisticated crypto fund racing campaigns with
              institutional-level management and transparency.
            </p>
          </div>
          <div className="text-center">
            <div className="text-8xl opacity-80">🎯</div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">By the Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-primary-gray-dark rounded-xl p-8 text-center border border-primary-gray transition-all duration-300 hover:-translate-y-1 hover:border-accent-red hover:shadow-lg hover:shadow-red-500/10">
                <div className="text-4xl font-extrabold text-accent-red mb-2">{stat.number}</div>
                <div className="text-sm text-primary-gray-light font-medium uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-4xl font-bold mb-8 text-white">Our Story</h2>
            <div className="space-y-6 text-lg text-primary-gray-light leading-relaxed">
              <p>
                Founded in 2023, Crypto Fund Racing emerged from the vision to bridge the gap between
                institutional-grade investment strategies and retail investors. Our founders recognized
                that while cryptocurrency offered unprecedented opportunities, most investors lacked
                access to professional management and sophisticated trading strategies.
              </p>
              <p>
                By leveraging blockchain technology and smart contracts, we've created a platform where
                investors can pool resources and benefit from expert fund management, all while maintaining
                complete transparency and security.
              </p>
              <p>
                Today, we're proud to serve thousands of investors worldwide, managing millions in assets
                and consistently delivering competitive returns through our innovative fund racing approach.
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-primary-gray-dark rounded-xl p-12 border border-primary-gray">
              <div className="text-6xl text-primary-gray-light">📈 Growth Chart</div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-primary-gray-dark rounded-xl p-8 text-center border border-primary-gray transition-all duration-300 hover:-translate-y-1 hover:border-accent-red hover:shadow-lg hover:shadow-red-500/10">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-4 text-white">Security First</h3>
              <p className="text-primary-gray-light leading-relaxed text-sm">Every investment is protected by audited smart contracts and industry-leading security practices.</p>
            </div>
            <div className="bg-primary-gray-dark rounded-xl p-8 text-center border border-primary-gray transition-all duration-300 hover:-translate-y-1 hover:border-accent-red hover:shadow-lg hover:shadow-red-500/10">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-4 text-white">Transparency</h3>
              <p className="text-primary-gray-light leading-relaxed text-sm">Real-time reporting and complete visibility into fund performance and strategy execution.</p>
            </div>
            <div className="bg-primary-gray-dark rounded-xl p-8 text-center border border-primary-gray transition-all duration-300 hover:-translate-y-1 hover:border-accent-red hover:shadow-lg hover:shadow-red-500/10">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-4 text-white">Innovation</h3>
              <p className="text-primary-gray-light leading-relaxed text-sm">Constantly evolving our platform with cutting-edge technology and trading strategies.</p>
            </div>
            <div className="bg-primary-gray-dark rounded-xl p-8 text-center border border-primary-gray transition-all duration-300 hover:-translate-y-1 hover:border-accent-red hover:shadow-lg hover:shadow-red-500/10">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-4 text-white">Community</h3>
              <p className="text-primary-gray-light leading-relaxed text-sm">Building a supportive ecosystem where investors and managers collaborate for mutual success.</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-4 text-white">Meet Our Team</h2>
          <p className="text-xl text-primary-gray-light text-center mb-12">Industry experts dedicated to your financial success</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-primary-gray-dark rounded-xl p-8 text-center border border-primary-gray transition-all duration-300 hover:-translate-y-1 hover:border-accent-red hover:shadow-lg hover:shadow-red-500/10">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{member.name}</h3>
                <div className="text-accent-red font-medium mb-4">{member.role}</div>
                <p className="text-primary-gray-light leading-relaxed text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-primary-gray-dark rounded-2xl p-12 border border-primary-gray">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Join the Race?</h2>
          <p className="text-xl text-primary-gray-light mb-8 max-w-2xl mx-auto">Start your journey to financial success with Crypto Fund Racing</p>
          <button className="bg-accent-red text-white border-none py-4 px-8 rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-red-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-500/40 hover:bg-accent-red-dark">Get Started Today</button>
        </div>
      </div>
    </section>
  );
};

export default About;