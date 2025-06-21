import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getApiUrl } from '../config/api';
import axios from 'axios';

interface AgentFormData {
  name: string;
  companyName: string;
  personality: string;
  companyInfo: string;
  prompts: string[];
}

const EditAgent: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { agentId } = useParams<{ agentId: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    companyName: '',
    personality: '',
    companyInfo: '',
    prompts: ['']
  });

  useEffect(() => {
    fetchAgent();
  }, [agentId]);

  const fetchAgent = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(getApiUrl(`/api/agents/${agentId}`), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching agent:', error);
      setError('Failed to load agent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
    setSaving(true);
    setError(null);

    try {
      // Filter out empty prompts
      const filteredPrompts = formData.prompts.filter(prompt => prompt.trim() !== '');
      
      const token = localStorage.getItem('token');
      await axios.put(getApiUrl(`/api/agents/${agentId}`), {
        ...formData,
        prompts: filteredPrompts
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      navigate('/agents');
    } catch (error) {
      console.error('Error updating agent:', error);
      setError('Failed to update agent. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F7F0] via-[#E8F0E3] to-[#EBFFD8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#819A91]"></div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-[#2C3E2D]">Edit Agent</h1>
        </div>

        <div className="bg-[#819A91]/10 backdrop-blur-xl rounded-xl p-8 border border-[#819A91]/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-[#E07B67]/20 border border-[#E07B67]/50 text-[#E07B67] px-4 py-3 rounded-lg">
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
                  className="w-full px-4 py-3 bg-white/80 border border-[#819A91]/30 rounded-lg text-[#2C3E2D] placeholder-[#2C3E2D]/50 focus:outline-none focus:ring-2 focus:ring-[#819A91]/50 focus:border-transparent transition-all duration-300"
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
                  className="w-full px-4 py-3 bg-white/80 border border-[#819A91]/30 rounded-lg text-[#2C3E2D] placeholder-[#2C3E2D]/50 focus:outline-none focus:ring-2 focus:ring-[#819A91]/50 focus:border-transparent transition-all duration-300"
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
                className="w-full px-4 py-3 bg-white/80 border border-[#819A91]/30 rounded-lg text-[#2C3E2D] placeholder-[#2C3E2D]/50 focus:outline-none focus:ring-2 focus:ring-[#819A91]/50 focus:border-transparent transition-all duration-300"
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
                className="w-full px-4 py-3 bg-white/80 border border-[#819A91]/30 rounded-lg text-[#2C3E2D] placeholder-[#2C3E2D]/50 focus:outline-none focus:ring-2 focus:ring-[#819A91]/50 focus:border-transparent transition-all duration-300"
                placeholder="Provide information about your company, products, services, and common customer issues..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[#2C3E2D]/90">Custom Prompts</label>
                <button
                  type="button"
                  onClick={addPrompt}
                  className="text-[#819A91] hover:text-[#819A91]/80 transition-all duration-300"
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
                      className="flex-1 px-4 py-3 bg-white/80 border border-[#819A91]/30 rounded-lg text-[#2C3E2D] placeholder-[#2C3E2D]/50 focus:outline-none focus:ring-2 focus:ring-[#819A91]/50 focus:border-transparent transition-all duration-300"
                      placeholder="Enter a custom prompt for the agent..."
                    />
                    {formData.prompts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePrompt(index)}
                        className="px-3 py-2 bg-[#E07B67]/20 hover:bg-[#E07B67]/30 text-[#E07B67] rounded-lg transition-all duration-300"
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
                className="px-6 py-3 bg-white/30 hover:bg-white/40 text-[#2C3E2D] rounded-lg transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-[#819A91] hover:bg-[#819A91]/90 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAgent; 