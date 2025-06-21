import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface AgentFormData {
  name: string;
  companyName: string;
  personality: string;
  companyInfo: string;
  prompts: string[];
}

const CreateAgent: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    companyName: '',
    personality: '',
    companyInfo: '',
    prompts: ['']
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePromptChange = (index: number, value: string) => {
    const newPrompts = [...formData.prompts];
    newPrompts[index] = value;
    setFormData(prev => ({ ...prev, prompts: newPrompts }));
  };

  const addPrompt = () => {
    setFormData(prev => ({ ...prev, prompts: [...prev.prompts, ''] }));
  };

  const removePrompt = (index: number) => {
    const newPrompts = formData.prompts.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, prompts: newPrompts }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Filter out empty prompts
      const filteredPrompts = formData.prompts.filter(prompt => prompt.trim() !== '');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }

      console.log('Sending request with token:', token);
      console.log('Form data:', formData);

      const response = await axios.post('/api/agents', {
        ...formData,
        prompts: filteredPrompts
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response:', response.data);
      navigate('/agents');
    } catch (error: any) {
      console.error('Detailed error:', error);
      console.error('Response:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to create agent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7F0] via-[#E8F0E3] to-[#EBFFD8] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/agents')}
            className="text-[#2C3E2D]/70 hover:text-[#2C3E2D] mr-4 transition-all duration-300"
          >
            ← Back to Agents
          </button>
          <h1 className="text-3xl font-bold text-[#2C3E2D]">Create New Agent</h1>
        </div>

        <div className="bg-[#819A91]/10 backdrop-blur-xl rounded-xl p-8 border border-[#819A91]/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-[#E07B67]/10 border border-[#E07B67]/20 text-[#E07B67] px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#2C3E2D]/90 mb-2">Agent Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/60 border border-[#819A91]/20 rounded-lg text-[#2C3E2D] placeholder-[#2C3E2D]/50 focus:outline-none focus:ring-2 focus:ring-[#819A91] focus:border-transparent transition-all duration-300"
                  placeholder="e.g., Support Bot, Customer Care AI"
                />
              </div>

              <div>
                <label className="block text-[#2C3E2D]/90 mb-2">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/60 border border-[#819A91]/20 rounded-lg text-[#2C3E2D] placeholder-[#2C3E2D]/50 focus:outline-none focus:ring-2 focus:ring-[#819A91] focus:border-transparent transition-all duration-300"
                  placeholder="e.g., TechCorp Inc."
                />
              </div>
            </div>

            <div>
              <label className="block text-[#2C3E2D]/90 mb-2">Personality</label>
              <textarea
                name="personality"
                value={formData.personality}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-3 bg-white/60 border border-[#819A91]/20 rounded-lg text-[#2C3E2D] placeholder-[#2C3E2D]/50 focus:outline-none focus:ring-2 focus:ring-[#819A91] focus:border-transparent transition-all duration-300"
                placeholder="Describe the agent's personality, tone, and communication style..."
              />
            </div>

            <div>
              <label className="block text-[#2C3E2D]/90 mb-2">Company Information</label>
              <textarea
                name="companyInfo"
                value={formData.companyInfo}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-white/60 border border-[#819A91]/20 rounded-lg text-[#2C3E2D] placeholder-[#2C3E2D]/50 focus:outline-none focus:ring-2 focus:ring-[#819A91] focus:border-transparent transition-all duration-300"
                placeholder="Provide information about your company, products, services, and common customer issues..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[#2C3E2D]/90">Custom Prompts</label>
                <button
                  type="button"
                  onClick={addPrompt}
                  className="text-[#819A91] hover:text-[#6B8A7A] transition-all duration-300"
                >
                  + Add Prompt
                </button>
              </div>
              <div className="space-y-3">
                {formData.prompts.map((prompt, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => handlePromptChange(index, e.target.value)}
                      className="flex-1 px-4 py-3 bg-white/60 border border-[#819A91]/20 rounded-lg text-[#2C3E2D] placeholder-[#2C3E2D]/50 focus:outline-none focus:ring-2 focus:ring-[#819A91] focus:border-transparent transition-all duration-300"
                      placeholder="Enter a custom prompt for the agent..."
                    />
                    {formData.prompts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePrompt(index)}
                        className="px-3 py-2 bg-[#E07B67]/10 hover:bg-[#E07B67]/20 text-[#D06858] rounded-lg transition-all duration-300"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/agents')}
                className="px-6 py-3 bg-white/60 hover:bg-white/80 text-[#2C3E2D] rounded-lg transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#819A91] hover:bg-[#6B8A7A] text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Agent'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAgent; 