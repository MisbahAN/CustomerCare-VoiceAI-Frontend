import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLiveKit } from '../contexts/LiveKitContext';
import axios from 'axios';
import { MicrophoneIcon, PhoneIcon, PhoneXMarkIcon } from '@heroicons/react/24/solid';
import { useNavigate, useParams } from 'react-router-dom';

interface LiveCallProps {
  roomName?: string;
}

const LiveCall: React.FC<LiveCallProps> = ({ roomName: propRoomName }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { roomName: urlRoomName } = useParams<{ roomName: string }>();
  const { connect, disconnect, isConnected, localParticipant, remoteParticipants } = useLiveKit();
  
  const [roomName, setRoomName] = useState<string>(propRoomName || urlRoomName || '');
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Handle joining a room
  const joinRoom = async () => {
    if (!roomName.trim()) {
      setError('Please enter a room name');
      return;
    }

    if (!user) {
      setError('You must be logged in to join a room');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // First create the room
      const createResponse = await axios.post('/api/livekit/create-room', {
        roomName: roomName.trim(),
        participantName: user.name,
        participantIdentity: user._id
      });

      // Then join the room
      const joinResponse = await axios.post('/api/livekit/join-room', {
        roomName: roomName.trim(),
        participantName: user.name,
        participantIdentity: user._id
      });
      
      const { participantToken, wsUrl } = joinResponse.data;
      
      // Connect to LiveKit room using the participant token
      await connect(participantToken, wsUrl, roomName);
      setIsJoining(true);
    } catch (err: any) {
      console.error('Error joining room:', err);
      setError(err.response?.data?.error || 'Failed to join room');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle leaving a room
  const leaveRoom = () => {
    disconnect();
    setIsJoining(false);
    setRoomName('');
  };
  
  // Handle toggling mute
  const toggleMute = () => {
    if (localParticipant) {
      localParticipant.setMicrophoneEnabled(!isMuted);
      setIsMuted(!isMuted);
    }
  };
  
  // Handle joining test room
  const joinTestRoom = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create test room and get token
      const testRoomResponse = await axios.post('/api/livekit/create-test-room');
      console.log('Test room created:', testRoomResponse.data);
      
      // Set room name to test-room
      setRoomName('test-room');
      
      // Get the token and WebSocket URL from the response
      const { token, wsUrl } = testRoomResponse.data;
      
      // Ensure the WebSocket URL is properly formatted
      const formattedWsUrl = wsUrl.startsWith('wss://') ? wsUrl : `wss://${wsUrl.replace(/^https?:\/\//, '')}`;
      console.log('Formatted WebSocket URL:', formattedWsUrl);
      
      // Connect to LiveKit room using the participant token
      await connect(token, formattedWsUrl, 'test-room');
      setIsJoining(true);
    } catch (err: any) {
      console.error('Error joining test room:', err);
      setError(err.response?.data?.error || err.message || 'Failed to join test room');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, [disconnect, isConnected]);
  
  // Handle audio playback
  useEffect(() => {
    if (remoteParticipants.length > 0 && audioRef.current) {
      // Get the first audio track from the first remote participant
      const audioTracks = Array.from(remoteParticipants[0].audioTracks.values());
      if (audioTracks.length > 0) {
        // Subscribe to the track if not already subscribed
        const track = audioTracks[0];
        if (track.kind === 'audio' && !track.isSubscribed) {
          track.setSubscribed(true);
        }
        
        // When the track is subscribed, set it as the audio source
        track.on('subscribed', (track) => {
          if (audioRef.current && track.mediaStream) {
            audioRef.current.srcObject = track.mediaStream;
          }
        });
      }
    }
  }, [remoteParticipants]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#F5F7F0] via-[#E8F0E3] to-[#EBFFD8] p-4">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-lg shadow-lg border border-[#819A91]/20 p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#2C3E2D]">Live Call</h1>
        
        {error && (
          <div className="bg-[#E07B67]/10 border border-[#E07B67]/20 text-[#E07B67] px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {!isJoining ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="roomName" className="block text-sm font-medium text-[#2C3E2D] mb-1">
                Room Name
              </label>
              <input
                type="text"
                id="roomName"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full px-3 py-2 border border-[#819A91]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#819A91] focus:border-[#819A91] bg-white/50 text-[#2C3E2D]"
                placeholder="Enter room name"
                disabled={isLoading}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={joinRoom}
                disabled={isLoading}
                className="w-full bg-[#819A91] text-white py-2 px-4 rounded-md hover:bg-[#6B8A7A] focus:outline-none focus:ring-2 focus:ring-[#819A91] focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Joining...' : 'Join Room'}
              </button>
              
              <button
                onClick={joinTestRoom}
                disabled={isLoading}
                className="w-full bg-[#7FB069] text-white py-2 px-4 rounded-md hover:bg-[#6B9C56] focus:outline-none focus:ring-2 focus:ring-[#7FB069] focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Joining...' : 'Join Test Room'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-[#7FB069]/10 border border-[#7FB069]/30 text-[#7FB069] px-4 py-3 rounded mb-4">
              Connected to room: <span className="font-bold">{roomName}</span>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full ${
                  isMuted ? 'bg-[#E07B67]' : 'bg-[#7FB069]'
                } text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#819A91]`}
              >
                <MicrophoneIcon className="h-6 w-6" />
              </button>
              
              <button
                onClick={leaveRoom}
                className="p-3 rounded-full bg-[#E07B67] text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#819A91]"
              >
                <PhoneXMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mt-6">
              <h2 className="text-lg font-medium mb-2 text-[#2C3E2D]">Participants</h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-5 w-5 text-[#7FB069]" />
                  <span className="text-[#2C3E2D]">You (Local)</span>
                </div>
                
                {remoteParticipants.map((participant) => (
                  <div key={participant.identity} className="flex items-center space-x-2">
                    <PhoneIcon className="h-5 w-5 text-[#819A91]" />
                    <span className="text-[#2C3E2D]">{participant.identity}</span>
                  </div>
                ))}
                
                {remoteParticipants.length === 0 && (
                  <p className="text-[#819A91] italic">Waiting for others to join...</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Hidden audio element for remote audio */}
        <audio ref={audioRef} autoPlay playsInline className="hidden" />
      </div>
    </div>
  );
};

export default LiveCall; 