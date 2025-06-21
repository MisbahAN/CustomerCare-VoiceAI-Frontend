# CustomerCare-VoiceAI Frontend

The React-based frontend for the CustomerCare-VoiceAI platform, providing an intuitive interface for AI-powered customer service training and conversation simulation. Features a beautiful matcha/pistachio theme with glassmorphism effects and real-time voice communication.

## 🌐 Live Demo

- **Frontend**: [https://customer-care-voice-ai-frontend.vercel.app/](https://customer-care-voice-ai-frontend.vercel.app/)
- **Backend API**: [https://customercare-voiceai-backend.onrender.com](https://customercare-voiceai-backend.onrender.com)

## 🌟 Features

- 🎨 **Modern UI/UX** – Built with React 18, TypeScript, and Tailwind CSS with matcha/pistachio design
- 💬 **Real-time Chat Interface** – Seamless conversation experience with Socket.io
- 🎤 **Voice Communication** – Integrated voice calls using LiveKit with real-time audio
- 🔊 **Advanced Audio Processing** – Support for both blob audio data and traditional audio URLs
- 📊 **Analytics Dashboard** – Comprehensive performance tracking with Chart.js visualizations
- 🤖 **Agent Management** – Create and customize AI support agents
- 📱 **Responsive Design** – Mobile-first approach with glassmorphism animations
- 🔐 **Secure Authentication** – JWT-based user authentication system
- 📈 **Real-time Updates** – Live conversation updates and typing indicators
- 🌿 **Matcha Theme** – Calming nature-inspired design with accessibility focus

## ⚙️ Tech Stack

| Category        | Technology                               |
| --------------- | ---------------------------------------- |
| **Framework**   | React 18 with TypeScript                 |
| **Styling**     | Tailwind CSS with Headless UI components |
| **Theme**       | Custom matcha/pistachio design system    |
| **Routing**     | React Router DOM v6                      |
| **State Mgmt**  | React Context API + Custom Hooks         |
| **Real-time**   | Socket.io Client, LiveKit Client         |
| **HTTP Client** | Axios for API communication              |
| **Charts**      | Chart.js with React wrapper              |
| **Icons**       | Heroicons                                |
| **Build Tool**  | Create React App with React Scripts      |

## 🎨 Design System

### Matcha/Pistachio Theme

The frontend features a modern, calming aesthetic:

**Color Palette:**

- **Primary Matcha**: `#819A91` - Primary buttons and accents
- **Secondary Sage**: `#6B8A7A` - Hover states and secondary elements
- **Accent Pistachio**: `#7FB069` - Highlights and success states
- **Background Gradient**: `#F5F7F0` to `#E8F0E3` to `#EBFFD8` - Light, warm backgrounds
- **Text Dark Green**: `#2C3E2D` - Primary text color for readability
- **Error Coral**: `#E07B67` - Error states and warnings

**Design Features:**

- **Glassmorphism Effects**: Translucent elements with backdrop blur
- **Natural Colors**: Earth-tones inspired by matcha and pistachio
- **Smooth Animations**: Glow effects and gradient animations
- **High Contrast**: Excellent readability and accessibility
- **Mobile-First**: Responsive design for all devices

## 🛠 Project Structure

```
src/
├── components/           # Reusable React components
│   ├── Navbar.tsx        # Navigation bar with matcha theme
│   └── ProtectedRoute.tsx # Route protection component
├── pages/                # Page components
│   ├── Dashboard.tsx     # User dashboard with analytics
│   ├── Login.tsx         # Authentication page
│   ├── Register.tsx      # User registration
│   ├── Agents.tsx        # Agent management
│   ├── CreateAgent.tsx   # Agent creation form
│   ├── EditAgent.tsx     # Agent editing
│   ├── AgentCall.tsx     # Voice call with agent
│   ├── AgentHistory.tsx  # Agent conversation history
│   ├── LiveCall.tsx      # Live voice call interface
│   ├── CallSimulator.tsx # Call simulation
│   ├── Conversations.tsx # Conversation management
│   ├── ConversationList.tsx # Conversation list view
│   └── ConversationDetail.tsx # Individual conversation view
├── contexts/             # React contexts
│   ├── AuthContext.tsx   # User authentication state
│   └── LiveKitContext.tsx # Voice call state management
├── types/                # TypeScript interfaces
│   ├── conversation.ts   # Conversation and message types
│   └── global.d.ts       # Global type definitions
├── styles/               # CSS files and animations
│   └── animations.css    # Glassmorphism effects and animations
├── config/               # Configuration files
│   └── api.ts           # API configuration and URL helpers
├── App.tsx               # Main application component
├── index.tsx             # React DOM entry point
└── index.css             # Global styles with matcha theme
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend server running (see deployment URLs above)

### Installation

1. **Clone and navigate to the repository**

   ```bash
   git clone <repository-url>
   cd CustomerCare-VoiceAI-Frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   Create `.env` in the root directory:

   ```env
   REACT_APP_API_URL=https://customercare-voiceai-backend.onrender.com
   REACT_APP_SOCKET_URL=https://customercare-voiceai-backend.onrender.com
   ```

   For local development:

   ```env
   REACT_APP_API_URL=http://localhost:5001
   REACT_APP_SOCKET_URL=http://localhost:5001
   ```

4. **Start development server**

   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`

## 🎯 Key Components

### Authentication System

Complete authentication flow with modern design:

- **Login/Register**: User authentication with glassmorphism forms
- **Protected Routes**: Route guards for authenticated users
- **Token Management**: Automatic JWT token refresh and storage
- **Context Provider**: Global authentication state management

### Chat Interface

Real-time chat functionality:

- **Message Display**: Threaded conversation view
- **Typing Indicators**: Live typing status with matcha-themed animations
- **Audio Playback**: Support for both base64 audio data and URL-based audio
- **Message History**: Conversation persistence with beautiful styling
- **Agent Interaction**: Dynamic conversation with AI agents

### Voice Communication

Integrated voice calling features:

- **LiveKit Integration**: Real-time voice communication
- **Audio Controls**: Microphone and speaker management
- **Participant Management**: Multi-user voice rooms
- **Connection Status**: Real-time connection monitoring

### Audio Processing

Advanced audio handling capabilities:

- **Blob Audio Support**: Converts base64 audio data to playable blobs
- **Backward Compatibility**: Supports both new blob format and legacy audio URLs
- **Real-time Playback**: Seamless audio streaming during conversations
- **Cross-browser Support**: Compatible audio playback across different browsers

### Dashboard Analytics

Comprehensive analytics interface:

- **Performance Metrics**: Conversation statistics in glass cards
- **Charts and Graphs**: Visual data representation with Chart.js
- **Recent Activity**: Activity feed with enhanced readability
- **Progress Tracking**: User improvement metrics

### Agent Management

Create and manage AI agents:

- **Agent Creation**: Custom agent personality setup
- **Personality Configuration**: Behavior and response settings
- **Agent Testing**: Preview agent responses
- **Visual Cards**: Beautiful agent cards with glassmorphism effects

## 🔧 Development

### Available Scripts

```bash
# Development
npm start              # Start development server
npm run dev           # Start development server without opening browser
npm run build         # Build for production
npm run eject         # Eject from Create React App (irreversible)
```

### Environment Variables

```env
# API Configuration
REACT_APP_API_URL=https://customercare-voiceai-backend.onrender.com   # Backend API URL
REACT_APP_SOCKET_URL=https://customercare-voiceai-backend.onrender.com # Socket.io server URL
```

### Code Style and Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: React app configuration with TypeScript support
- **Tailwind CSS**: Utility-first styling with custom matcha theme
- **Component Architecture**: Functional components with hooks
- **Design System**: Consistent matcha color palette and glassmorphism

## 🎨 UI/UX Design

### Design System Features

- **Matcha Color Palette**: Calming, nature-inspired colors
- **Glassmorphism**: Modern translucent design elements
- **Typography**: Clear, readable font hierarchy
- **Spacing**: Consistent Tailwind CSS spacing scale
- **Components**: Reusable UI components with matcha styling
- **Animations**: Smooth transitions and micro-interactions

### Accessibility

- **High Contrast**: Dark green text on light backgrounds
- **Color Blindness**: Accessible color combinations
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **Touch Targets**: Appropriately sized touch targets

### Responsive Design

- **Mobile-First**: Designed for mobile devices first
- **Breakpoints**: Tailwind CSS responsive breakpoints
- **Touch-Friendly**: Optimized for touch interactions
- **Fluid Layouts**: Adapts to all screen sizes

## 🔍 Performance Optimization

### Bundle Optimization

- **Code Splitting**: Route-based code splitting with React.lazy
- **Tree Shaking**: Automatic removal of unused code
- **Image Optimization**: Optimized asset loading

### Runtime Performance

- **React.memo**: Prevents unnecessary re-renders
- **useMemo/useCallback**: Optimizes expensive computations
- **Debouncing**: Optimizes API calls and user input

## 🐛 Troubleshooting

### Common Issues

1. **Socket Connection Issues**

   ```bash
   # Check backend server status
   curl https://customercare-voiceai-backend.onrender.com/health

   # Verify environment variables
   echo $REACT_APP_SOCKET_URL
   ```

2. **Audio Playback Issues**

   - Check browser permissions for audio playback
   - Verify audio data format (base64 or URL)
   - Ensure backend audio endpoints are accessible

3. **LiveKit Connection Problems**

   - Verify LiveKit server is accessible
   - Check browser permissions for microphone
   - Ensure WebRTC is enabled in browser

4. **Build Issues**

   ```bash
   # Clear cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📚 API Integration

### Authentication API

```typescript
// Login user
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}

// Register user
POST /api/auth/register
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password"
}
```

### Agent Management API

```typescript
// Get user agents
GET /api/agents

// Create agent
POST /api/agents
{
  "name": "Support Agent",
  "company": "TechCorp",
  "personality": "friendly",
  "companyInfo": "Technology company"
}

// Update agent
PUT /api/agents/:id
{
  "name": "Updated Agent Name"
}
```

### Conversation API

```typescript
// Get conversation history
GET /api/conversations

// Get specific conversation
GET /api/conversations/:id

// Create new conversation
POST /api/conversations
{
  "agentId": "agent123",
  "title": "Customer Support"
}
```

### Audio API

The frontend supports both audio formats:

```typescript
// New format (base64 blob)
{
  "message": "Hello",
  "audioData": "base64audiostring",
  "audioType": "audio/mpeg"
}

// Legacy format (URL-based)
{
  "message": "Hello",
  "audioUrl": "/audio/response-123.mp3"
}
```

## 🛣️ Future Enhancements

### Planned Features

- [ ] **Dark Mode Toggle**: Alternative to the matcha theme
- [ ] **PWA Features**: Offline support and push notifications
- [ ] **Advanced Analytics**: More detailed performance metrics
- [ ] **Multi-language**: Internationalization support
- [ ] **Export Features**: Conversation export functionality

### Technical Improvements

- [ ] **Testing**: Comprehensive test suite with Jest and React Testing Library
- [ ] **State Management**: Consider Redux Toolkit for complex state
- [ ] **Performance**: Implement service workers for caching
- [ ] **Security**: Enhanced CSP and security headers
- [ ] **Monitoring**: Error tracking and analytics integration

## 📖 Technology Deep Dive

### React Context Architecture

The application uses a well-structured Context API setup:

- **AuthContext**: Manages user authentication, JWT tokens, and user session
- **LiveKitContext**: Handles voice communication state and WebRTC connections

### TypeScript Integration

Strong typing throughout the application:

- **Message Types**: Comprehensive interfaces for conversation data
- **API Types**: Typed API responses and requests
- **Component Props**: Fully typed component interfaces

### Audio Processing

Advanced audio handling with dual format support:

```typescript
// Audio blob creation from base64
const createAudioUrl = (audioData: string, audioType: string): string => {
  const audioBlob = new Blob(
    [Uint8Array.from(atob(audioData), (c) => c.charCodeAt(0))],
    { type: audioType }
  );
  return URL.createObjectURL(audioBlob);
};
```

---

## 📊 Project Status

- ✅ **Frontend**: Fully deployed and functional
- ✅ **Backend**: Live API with real-time capabilities
- ✅ **Authentication**: Complete JWT implementation
- ✅ **Real-time Chat**: Socket.io integration working
- ✅ **Voice Calls**: LiveKit integration functional
- ✅ **Audio Processing**: Dual format support implemented
- ✅ **Analytics**: Chart.js visualizations active
- ✅ **Responsive Design**: Mobile-optimized interface

**Overall Completion**: 95% - Production-ready application with comprehensive features and modern architecture.

## 👨‍💻 Author

**Misbah Ahmed Nauman**

- 🌐 [Portfolio](https://misbahan.com)
- 🛠️ Built during Headstarter SWE Residency (Past Project)
