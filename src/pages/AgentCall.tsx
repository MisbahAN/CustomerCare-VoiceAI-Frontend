import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getApiUrl } from '../config/api';
import axios from 'axios';
import io, { Socket } from 'socket.io-client';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  audioUrl?: string;
  audioData?: string;
  audioType?: string;
  timestamp?: Date;
}

interface AgentState {
  agentId: string;
  agentName: string;
  companyName: string;
  personality: string;
  companyInfo: string;
  prompts: string[];
}

const AgentCall: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { agentName } = useParams<{ agentName: string }>();
  const agentState = location.state as AgentState;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [ripples, setRipples] = useState<{ id: number; scale: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket>();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const rippleInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!agentState) {
      navigate('/agents');
      return;
    }

    // Connect to socket
    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || getApiUrl("");
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
      if (user?._id && agentState) {
        console.log('Starting conversation with agent:', {
          userId: user._id,
          agentId: agentState.agentId,
          agentInfo: {
            name: agentState.agentName,
            company: agentState.companyName,
            personality: agentState.personality,
            companyInfo: agentState.companyInfo,
            prompts: agentState.prompts
          }
        });

        socketRef.current?.emit('start_conversation', {
          userId: user._id,
          agentId: agentState.agentId,
          agentInfo: {
            name: agentState.agentName,
            company: agentState.companyName,
            personality: agentState.personality,
            companyInfo: agentState.companyInfo,
            prompts: agentState.prompts
          },
          isCallSimulator: false
        });
      }
    });

    socketRef.current.on('typing', (isTyping: boolean) => {
      setIsTyping(isTyping);
      setIsAgentSpeaking(isTyping);
    });

    socketRef.current.on('conversation_started', (data) => {
      console.log('Conversation started:', data);
      setConversationId(data.conversationId);
      if (data.welcomeMessage) {
        const welcomeMessage: Message = {
          id: crypto.randomUUID(),
          role: data.welcomeMessage.role,
          content: data.welcomeMessage.content,
          timestamp: new Date(data.welcomeMessage.timestamp),
          audioUrl: data.welcomeMessage.audioUrl,
          audioData: data.welcomeMessage.audioData,
          audioType: data.welcomeMessage.audioType
        };
        setMessages(prev => [...prev, welcomeMessage]);

        // Play welcome message audio
        if (welcomeMessage.audioData && welcomeMessage.audioType) {
          const audioUrl = createAudioUrl(welcomeMessage.audioData, welcomeMessage.audioType);
          playAudioMessage(audioUrl);
        } else if (welcomeMessage.audioUrl) {
          playAudioMessage(`${getApiUrl("")}${welcomeMessage.audioUrl}`);
        }
      }
    });

    socketRef.current.on('ai_response', (data) => {
      console.log('Received AI response:', data);
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
        audioUrl: data.audioUrl,
        audioData: data.audioData,
        audioType: data.audioType,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      setIsProcessing(false);

      // Play AI response audio
      if (data.audioData && data.audioType) {
        const audioUrl = createAudioUrl(data.audioData, data.audioType);
        playAudioMessage(audioUrl);
      } else if (data.audioUrl) {
        playAudioMessage(`${getApiUrl("")}${data.audioUrl}`);
      }
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
      setError(error.message);
      setIsProcessing(false);
      setIsTyping(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [agentState, user, navigate]);

  const createAudioUrl = (audioData: string, audioType: string): string => {
    const audioBlob = new Blob([Uint8Array.from(atob(audioData), c => c.charCodeAt(0))], { type: audioType });
    return URL.createObjectURL(audioBlob);
  };

  const playAudioMessage = (audioUrl: string) => {
    // Stop any currently playing audio
    const audioElements = document.getElementsByTagName('audio');
    Array.from(audioElements).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });

    const audio = new Audio(audioUrl);
    audio.onplay = () => setIsAgentSpeaking(true);
    audio.onended = () => setIsAgentSpeaking(false);
    audio.onpause = () => setIsAgentSpeaking(false);
    audio.play().catch(console.error);
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const sendMessage = (message: string) => {
    if (!socketRef.current || !conversationId || !message.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);

    socketRef.current.emit('user_message', {
      conversationId,
      message,
      userId: user?._id,
      agentId: agentState?.agentId,
      agentInfo: {
        name: agentState.agentName,
        company: agentState.companyName,
        personality: agentState.personality,
        companyInfo: agentState.companyInfo,
        prompts: agentState.prompts
      }
    });
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartRecording = async () => {
    try {
      // Clean up any existing recording session
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      startRippleEffect();
      
      // Set up speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map(result => result.transcript)
            .join('');
          
          setInputMessage(transcript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          handleStopRecording();
        };

        recognitionRef.current.onend = () => {
          // Only restart if still recording
          if (isRecording) {
            recognitionRef.current?.start();
          }
        };
        
        recognitionRef.current.start();
      }
      
      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        if (inputMessage) {
          const formData = new FormData();
          formData.append('audio', audioBlob);
          formData.append('transcript', inputMessage);
          
          try {
            await axios.post(`/api/conversations/${conversationId}/audio`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
            
            handleSendMessage();
          } catch (error) {
            console.error('Error sending audio:', error);
            handleSendMessage();
          }
        }
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check your permissions.');
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    stopRippleEffect();
    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const startRippleEffect = () => {
    if (rippleInterval.current) return;
    
    rippleInterval.current = setInterval(() => {
      setRipples(prev => {
        const filtered = prev.filter(r => r.scale < 2);
        return [...filtered, { id: Date.now(), scale: 0 }].map(r => ({
          ...r,
          scale: r.scale + 0.1
        }));
      });
    }, 150);
  };

  const stopRippleEffect = () => {
    if (rippleInterval.current) {
      clearInterval(rippleInterval.current);
      rippleInterval.current = null;
    }
    setRipples([]);
  };

  const handleEndCall = async () => {
    try {
      if (conversationId) {
        await axios.put(`/api/conversations/${conversationId}/end`);
      }
      navigate('/agents');
    } catch (error) {
      console.error('Error ending call:', error);
      navigate('/agents'); // Navigate anyway even if there's an error
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7F0] via-[#E8F0E3] to-[#EBFFD8]">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#2C3E2D]">Call with {agentState?.agentName}</h1>
            <p className="text-[#2C3E2D]/70">{agentState?.companyName}</p>
          </div>
          <button
            onClick={handleEndCall}
            className="px-4 py-2 text-[#2C3E2D]/70 hover:text-[#2C3E2D] bg-[#2C3E2D]/10 hover:bg-[#2C3E2D]/20 rounded-lg transition-all duration-300"
          >
            End Call
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-[#819A91]/20 overflow-hidden">
          <div className="h-[600px] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } items-end space-x-3`}
              >
                {message.role === 'assistant' && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#819A91] flex-shrink-0 ring-2 ring-[#2C3E2D]/30">
                    <div className="w-full h-full p-1 text-white flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                      </svg>
                    </div>
                    {isAgentSpeaking && message.id === messages[messages.length - 1].id && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7FB069]/75 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-[#7FB069]"></span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-[#819A91] text-white'
                    : 'bg-[#2C3E2D]/10 text-[#2C3E2D]'
                }`}>
                  <p>{message.content}</p>
                  {(message.audioData && message.audioType) || message.audioUrl ? (
                    <audio
                      controls
                      className="mt-2"
                      src={message.audioData && message.audioType ? createAudioUrl(message.audioData, message.audioType) : `${getApiUrl("")}${message.audioUrl}`}
                      onPlay={() => message.role === 'assistant' && setIsAgentSpeaking(true)}
                      onPause={() => setIsAgentSpeaking(false)}
                      onEnded={() => setIsAgentSpeaking(false)}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  ) : null}
                </div>

                {message.role === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#819A91] to-[#7FB069] flex-shrink-0 flex items-center justify-center ring-2 ring-[#2C3E2D]/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start items-end space-x-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#819A91] flex-shrink-0 ring-2 ring-[#2C3E2D]/30">
                  <div className="w-full h-full p-1 text-white flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                  </div>
                </div>
                <div className="bg-[#2C3E2D]/10 text-[#2C3E2D] rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-[#2C3E2D]/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-[#2C3E2D]/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-[#2C3E2D]/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-[#2C3E2D]/10">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-[#2C3E2D]/5 border border-[#2C3E2D]/10 rounded-lg text-[#2C3E2D] placeholder-[#2C3E2D]/50"
                disabled={isRecording}
              />
              
              <button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`${
                  isRecording
                    ? 'bg-[#E07B67] hover:bg-[#E07B67]/80'
                    : 'bg-[#819A91] hover:bg-[#819A91]/80'
                } text-white p-3 rounded-lg transition-all duration-300 relative`}
                disabled={isProcessing}
              >
                {isRecording ? (
                  <>
                    <StopIcon className="h-5 w-5" />
                    {ripples.map(ripple => (
                      <div
                        key={ripple.id}
                        className="absolute inset-0 border-2 border-[#E07B67]/50 rounded-lg"
                        style={{
                          transform: `scale(${ripple.scale})`,
                          opacity: 2 - ripple.scale,
                        }}
                      />
                    ))}
                  </>
                ) : (
                  <MicrophoneIcon className="h-5 w-5" />
                )}
              </button>

              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isProcessing || isRecording}
                className={`${
                  !inputMessage.trim() || isProcessing || isRecording
                    ? 'bg-[#2C3E2D]/50 cursor-not-allowed'
                    : 'bg-[#7FB069] hover:bg-[#7FB069]/80'
                } text-white p-3 rounded-lg transition-all duration-300`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCall; 