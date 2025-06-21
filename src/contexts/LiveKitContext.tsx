import React, { createContext, useContext, useState, useCallback } from 'react';
import { Room, RoomEvent, RemoteParticipant, LocalParticipant, ConnectionState, RoomConnectOptions, RoomOptions } from 'livekit-client';

interface LiveKitContextType {
  room: Room | null;
  localParticipant: LocalParticipant | null;
  remoteParticipants: RemoteParticipant[];
  isConnected: boolean;
  connectionState: ConnectionState;
  connect: (token: string, url: string, roomName: string) => Promise<void>;
  disconnect: () => void;
}

const LiveKitContext = createContext<LiveKitContextType | null>(null);

export const LiveKitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [localParticipant, setLocalParticipant] = useState<LocalParticipant | null>(null);
  const [remoteParticipants, setRemoteParticipants] = useState<RemoteParticipant[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.Disconnected);

  const connect = useCallback(async (token: string, url: string, roomName: string) => {
    try {
      console.log(`Connecting to LiveKit room: ${roomName}`);
      console.log('WebSocket URL:', url);
      console.log('Token:', token);
      
      // Room configuration options
      const roomOptions: RoomOptions = {
        adaptiveStream: true,
        dynacast: true,
        stopLocalTrackOnUnpublish: true,
      };

      // Connection options
      const connectOptions: RoomConnectOptions = {
        autoSubscribe: true,
        rtcConfig: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ],
        },
      };

      // Create a new room
      const newRoom = new Room(roomOptions);

      // Set up event listeners before connecting
      newRoom.on(RoomEvent.SignalConnected, () => {
        console.log('Signal connection established');
      });

      newRoom.on(RoomEvent.Connected, () => {
        console.log('Room connection established');
      });

      newRoom.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        console.log(`Participant connected: ${participant.identity}`);
        setRemoteParticipants(prev => [...prev, participant]);
      });

      newRoom.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
        console.log(`Participant disconnected: ${participant.identity}`);
        setRemoteParticipants(prev => prev.filter(p => p.identity !== participant.identity));
      });

      newRoom.on(RoomEvent.ConnectionStateChanged, (state: ConnectionState) => {
        console.log(`Connection state changed: ${state}`);
        setConnectionState(state);
        setIsConnected(state === ConnectionState.Connected);
      });

      newRoom.on(RoomEvent.Disconnected, () => {
        console.log('Disconnected from room');
      });

      // Connect to the room
      await newRoom.connect(url, token, connectOptions);
      console.log('Successfully connected to LiveKit room');
      
      setRoom(newRoom);
      setLocalParticipant(newRoom.localParticipant);
      setRemoteParticipants(Array.from(newRoom.participants.values()));
      setIsConnected(true);
      setConnectionState(ConnectionState.Connected);
    } catch (error) {
      console.error('Failed to connect to LiveKit room:', error);
      setConnectionState(ConnectionState.Disconnected);
      setIsConnected(false);
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    if (room) {
      console.log('Disconnecting from LiveKit room');
      room.disconnect();
      setRoom(null);
      setLocalParticipant(null);
      setRemoteParticipants([]);
      setIsConnected(false);
      setConnectionState(ConnectionState.Disconnected);
    }
  }, [room]);

  return (
    <LiveKitContext.Provider
      value={{
        room,
        localParticipant,
        remoteParticipants,
        isConnected,
        connectionState,
        connect,
        disconnect,
      }}
    >
      {children}
    </LiveKitContext.Provider>
  );
};

export const useLiveKit = () => {
  const context = useContext(LiveKitContext);
  if (!context) {
    throw new Error('useLiveKit must be used within a LiveKitProvider');
  }
  return context;
}; 