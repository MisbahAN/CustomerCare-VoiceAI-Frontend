import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api';
import axios from 'axios';
import { format, isValid } from 'date-fns';
import { ArrowLeftIcon, ClockIcon, ChartBarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { Conversation, Message } from '../types/conversation';

// Helper function to safely format dates
const formatTimestamp = (timestamp: string | Date): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return isValid(date) ? format(date, 'h:mm a') : 'Invalid time';
};

const ConversationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const createAudioUrl = (audioData: string, audioType: string): string => {
    const audioBlob = new Blob([Uint8Array.from(atob(audioData), c => c.charCodeAt(0))], { type: audioType });
    return URL.createObjectURL(audioBlob);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(getApiUrl(`/api/conversations/${id}`));
        console.log('Fetched conversation data:', response.data); // Debug log
        console.log('Messages:', response.data.messages); // Debug messages specifically
        setConversation(response.data);
      } catch (err) {
        console.error('Error details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load conversation');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversation();
  }, [id]);

  const getSentimentColor = (sentiment: string) => {
    const colors: { [key: string]: string } = {
      positive: 'bg-[#7FB069]/30 text-[#7FB069] border-[#7FB069]/30',
      neutral: 'bg-[#819A91]/30 text-[#819A91] border-[#819A91]/30',
      negative: 'bg-[#E07B67]/30 text-[#E07B67] border-[#E07B67]/30',
      urgent: 'bg-yellow-500/30 text-yellow-300 border-yellow-500/30'
    };
    return colors[sentiment.toLowerCase()] || colors.neutral;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAudioPlay = (messageId: string) => {
    setIsPlaying(messageId);
  };

  const handleAudioEnd = () => {
    setIsPlaying(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#F5F7F0] to-[#E8F0E3]">
        <div className="text-[#2C3E2D] text-xl">Loading conversation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#F5F7F0] to-[#E8F0E3]">
        <div className="text-[#E07B67] text-xl">{error}</div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#F5F7F0] to-[#E8F0E3]">
        <div className="text-[#2C3E2D] text-xl">Conversation not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7F0] via-[#E8F0E3] to-[#EBFFD8] text-[#2C3E2D] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8 animate-fadeIn">
          <div>
            <button
              onClick={() => navigate('/conversations')}
              className="mb-4 text-[#2C3E2D]/80 hover:text-[#2C3E2D] flex items-center transition-all duration-300 hover:scale-105"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Conversations
            </button>
            <h1 className="text-3xl font-bold gradient-text">{conversation?.title}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-[#2C3E2D]/70">
              <ClockIcon className="h-5 w-5" />
              <span>{formatTimestamp(conversation?.metadata?.created || '')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="h-5 w-5 text-[#2C3E2D]/70" />
              <span className="text-[#2C3E2D]/70">{formatDuration(conversation?.metadata?.duration || 0)}</span>
            </div>
            <div className={`px-4 py-1 rounded-full text-sm font-medium ${getSentimentColor(conversation?.metadata?.sentiment || 'neutral')} border`}>
              {conversation?.metadata?.sentiment?.charAt(0).toUpperCase() + conversation?.metadata?.sentiment?.slice(1) || 'Neutral'}
            </div>
          </div>
        </div>

        <div className="glass-container rounded-3xl p-6 mb-8 animate-fadeIn">
          <div className="space-y-6">
            {/* Debug log */}
            {conversation?.messages && conversation.messages.length > 0 ? (
              conversation.messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-3 animate-slideIn`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {message.role === 'assistant' && (
                    <div className={`relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-[#819A91] ring-2 ring-[#2C3E2D]/30 animate-scaleIn`}>
                      <img
                        src="/ai-avatar.svg"
                        alt="AI Assistant"
                        className="w-full h-full object-contain p-1"
                      />
                      {isPlaying === `message-${index}` && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7FB069] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#7FB069]"></span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] group transform transition-all duration-300 hover:scale-[1.02] ${message.role === 'user' ? 'ml-4' : 'mr-4'}`}>
                    <div className={`px-6 py-3 rounded-2xl backdrop-blur-md shadow-lg ${
                      message.role === 'user'
                        ? 'bg-[#819A91]/80 text-white rounded-br-sm border border-[#819A91]/30'
                        : 'bg-[#2C3E2D]/10 text-[#2C3E2D]/90 rounded-bl-sm border border-[#2C3E2D]/20'
                    }`}>
                      <div className="flex items-center mb-2">
                        <span className={`text-sm font-medium ${message.role === 'user' ? 'text-white/90' : 'text-[#2C3E2D]/80'}`}>
                          {message.role === 'user' ? 'You' : 'AI Assistant'}
                        </span>
                        <span className={`mx-2 text-xs ${message.role === 'user' ? 'text-white/70' : 'text-[#2C3E2D]/50'}`}>•</span>
                        <span className={`text-xs ${message.role === 'user' ? 'text-white/70' : 'text-[#2C3E2D]/50'}`}>
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      {(message.audioData && message.audioType) || message.audioUrl ? (
                        <div className="mt-3">
                          <audio
                            controls
                            className="w-full h-8 rounded-lg opacity-70 hover:opacity-100 transition-opacity duration-300"
                            src={message.audioData && message.audioType ? createAudioUrl(message.audioData, message.audioType) : `${getApiUrl("")}${message.audioUrl}`}
                            onPlay={() => handleAudioPlay(`message-${index}`)}
                            onPause={handleAudioEnd}
                            onEnded={handleAudioEnd}
                          >
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#819A91] to-[#7FB069] flex-shrink-0 flex items-center justify-center ring-2 ring-[#2C3E2D]/30 animate-scaleIn">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-[#2C3E2D]/70">No messages in this conversation yet.</div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationDetail; 
