import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useWeb3 } from '../contexts/Web3Context';

const CreateCampaign: React.FC = () => {
  const { isConnected } = useAccount();
  const { contractService } = useWeb3();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    deadline: '',
    durationInHours: '',
    image: '',
    twitter: '',
    discord: '',
    telegram: '',
    website: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !contractService) {
      alert('Please connect your wallet to create a campaign');
      return;
    }

    if (!formData.targetAmount || !formData.durationInHours) {
      alert('Please fill in the target amount and duration');
      return;
    }

    const targetAmount = parseFloat(formData.targetAmount);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      alert('Please enter a valid target amount');
      return;
    }

    const durationInHours = parseInt(formData.durationInHours);
    if (isNaN(durationInHours) || durationInHours <= 0) {
      alert('Please enter a valid duration in hours');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Creating campaign:', formData);

      const txHash = await contractService.createPool(formData.targetAmount, durationInHours);

      alert(`Campaign created successfully! Transaction hash: ${txHash}`);

      // Reset form
      setFormData({
        title: '',
        description: '',
        targetAmount: '',
        deadline: '',
        durationInHours: '',
        image: '',
        twitter: '',
        discord: '',
        telegram: '',
        website: ''
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <section className="py-16 min-h-screen bg-gradient-to-br from-primary-black to-black/95">
        <div className="container">
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold mb-6 text-white">Create a Campaign</h1>
            <p className="text-xl text-primary-gray-light mb-8">Please connect your wallet to create a funding campaign.</p>
            <div className="text-6xl opacity-50">🔗</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 min-h-screen bg-gradient-to-br from-primary-black to-black/95">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 text-gradient">Create Funding Campaign</h1>
          <p className="text-xl text-primary-gray-light max-w-2xl mx-auto">Launch your crypto project and get funded by the community</p>
        </div>

        <form className="max-w-4xl mx-auto bg-white/5 rounded-2xl p-8 border border-white/10" onSubmit={handleSubmit}>
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-white">Project Details</h2>

            <div className="mb-6">
              <label htmlFor="title" className="block mb-2 font-semibold text-white">Pool Name (Optional)</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Optional name for your funding pool"
                className="w-full p-4 bg-white/5 border border-primary-gray rounded-lg text-white placeholder-primary-gray-light focus:outline-none focus:border-accent-red focus:ring-2 focus:ring-red-500/10 transition-colors"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block mb-2 font-semibold text-white">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Optional description for your funding pool..."
                rows={4}
                className="w-full p-4 bg-white/5 border border-primary-gray rounded-lg text-white placeholder-primary-gray-light focus:outline-none focus:border-accent-red focus:ring-2 focus:ring-red-500/10 transition-colors resize-vertical min-h-24"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="targetAmount" className="block mb-2 font-semibold text-white">Target Amount (ETH) *</label>
                <input
                  type="number"
                  id="targetAmount"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  placeholder="100.0"
                  step="0.1"
                  min="0.1"
                  className="w-full p-4 bg-white/5 border border-primary-gray rounded-lg text-white placeholder-primary-gray-light focus:outline-none focus:border-accent-red focus:ring-2 focus:ring-red-500/10 transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="durationInHours" className="block mb-2 font-semibold text-white">Duration (Hours) *</label>
                <input
                  type="number"
                  id="durationInHours"
                  name="durationInHours"
                  value={formData.durationInHours}
                  onChange={handleInputChange}
                  placeholder="168"
                  min="1"
                  className="w-full p-4 bg-white/5 border border-primary-gray rounded-lg text-white placeholder-primary-gray-light focus:outline-none focus:border-accent-red focus:ring-2 focus:ring-red-500/10 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="image" className="block mb-2 font-semibold text-white">Project Image URL</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full p-4 bg-white/5 border border-primary-gray rounded-lg text-white placeholder-primary-gray-light focus:outline-none focus:border-accent-red focus:ring-2 focus:ring-red-500/10 transition-colors"
              />
            </div>
          </div>


          <div className="text-center pt-8 border-t border-white/10">
            <button
              type="submit"
              className="bg-gradient-to-r from-accent-red to-accent-red-dark text-white border-none py-4 px-8 rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 min-w-48 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Campaign...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateCampaign;