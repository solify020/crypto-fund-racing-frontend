import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useWeb3 } from '../contexts/Web3Context';
import uploadPic from '../utils/uploadPic';

const CreateCampaign: React.FC = () => {
  const { isConnected } = useAccount();
  const { contractService } = useWeb3();
  const [formData, setFormData] = useState({
    purpose: '',
    targetAmount: '',
    deadline: '',
    durationInDays: '',
    socialLink: '',
    imageUrl: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !contractService) {
      alert('Please connect your wallet to create a campaign');
      return;
    }

    if (!formData.targetAmount || !formData.durationInDays) {
      alert('Please fill in the target amount and duration');
      return;
    }

    const targetAmount = parseFloat(formData.targetAmount);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      alert('Please enter a valid target amount');
      return;
    }

    const durationInDays = parseInt(formData.durationInDays);
    if (isNaN(durationInDays) || durationInDays <= 0) {
      alert('Please enter a valid duration in hours');
      return;
    }

    setIsSubmitting(true);
    setIsUploading(true);

    try {
      let imageUrl = '';
      
      // Upload file to IPFS if a file is selected
      if (selectedFile) {
        try {
          imageUrl = await uploadPic(selectedFile);
          console.log('File uploaded to IPFS:', imageUrl);
        } catch (uploadError) {
          console.error('File upload failed:', uploadError);
          alert('Failed to upload file to IPFS. Please try again.');
          setIsUploading(false);
          setIsSubmitting(false);
          return;
        }
      }

      setIsUploading(false);

      console.log('Creating campaign:', { ...formData, imageUrl });

      const txHash = await contractService.createPool(
        formData.targetAmount,
        durationInDays * 24,
        formData.socialLink,
        formData.purpose,
        imageUrl
      );

      alert(`Campaign created successfully! Transaction hash: ${txHash}`);

      // Reset form
      setFormData({
        purpose: '',
        targetAmount: '',
        deadline: '',
        durationInDays: '',
        socialLink: '',
        imageUrl: '',
      });
      setSelectedFile(null);
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <section className="py-16 min-h-screen bg-black">
        <div className="container">
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold mb-6 text-white">Create a Campaign</h1>
            <p className="text-xl text-white mb-8">Please connect your wallet to create a funding campaign.</p>
            <div className="text-6xl opacity-50">🔗</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 min-h-screen bg-black">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 text-white">Create Funding Campaign</h1>
          <p className="text-xl text-white max-w-2xl mx-auto">Launch your crypto project and get funded by the community</p>
        </div>

        <form className="max-w-4xl mx-auto bg-white/5 rounded-2xl p-8 border border-white/10" onSubmit={handleSubmit}>
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-white">Project Details</h2>

            <div className="mb-6">
              <label htmlFor="purpose" className="block mb-2 font-semibold text-white">Donation Purpose</label>
              <input
                type="text"
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                placeholder="Optional name for your funding pool"
                className="w-full p-4 bg-white/5 border border-white rounded-lg text-white placeholder-white focus:outline-none focus:border-white focus:ring-2 focus:ring-white/10 transition-colors"
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
                  className="w-full p-4 bg-white/5 border border-white rounded-lg text-white placeholder-white focus:outline-none focus:border-white focus:ring-2 focus:ring-white/10 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="durationInDays" className="block mb-2 font-semibold text-white">Duration (Days) *</label>
                <input
                  type="number"
                  id="durationInDays"
                  name="durationInDays"
                  value={formData.durationInDays}
                  onChange={handleInputChange}
                  placeholder="168"
                  min="1"
                  className="w-full p-4 bg-white/5 border border-white rounded-lg text-white placeholder-white focus:outline-none focus:border-white focus:ring-2 focus:ring-white/10 transition-colors"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="socialLink" className="block mb-2 font-semibold text-white">Social Media Link</label>
              <input
                type="url"
                id="socialLink"
                name="socialLink"
                value={formData.socialLink}
                onChange={handleInputChange}
                placeholder="https://x.com/yourproject"
                className="w-full p-4 bg-white/5 border border-white rounded-lg text-white placeholder-white focus:outline-none focus:border-white focus:ring-2 focus:ring-white/10 transition-colors"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="projectImage" className="block mb-2 font-semibold text-white">Project Image</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="projectImage"
                  accept="image/png"
                  onChange={handleFileChange}
                  className="w-full p-4 bg-white/5 border border-white rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200 file:transition-colors cursor-pointer focus:outline-none focus:border-white focus:ring-2 focus:ring-white/10 transition-colors"
                />
                {selectedFile && (
                  <div className="text-sm text-white">
                    <p>Selected: {selectedFile.name}</p>
                    <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-white/10">
            <button
              type="submit"
              className="bg-white text-black border-none py-4 px-8 rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 min-w-48 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:bg-black disabled:text-white disabled:border disabled:border-white"
              disabled={isSubmitting || isUploading}
            >
              {isUploading ? 'Uploading to IPFS...' : isSubmitting ? 'Creating Campaign...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateCampaign;