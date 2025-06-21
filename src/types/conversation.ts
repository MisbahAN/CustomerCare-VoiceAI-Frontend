export interface Conversation {
  _id: string;
  title: string;
  messages: Message[];
  metadata: {
    created: string;
    updated: string;
    duration: number;
    sentiment: string;
  };
  context: {
    company: string;
    lastActive: string;
    summary: string;
  };
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  audioUrl?: string;
  audioData?: string;
  audioType?: string;
} 