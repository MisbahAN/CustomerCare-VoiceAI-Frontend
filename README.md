# CustomerCare-VoiceAI Frontend

The React-based frontend for the CustomerCare-VoiceAI platform, providing an intuitive interface for AI-powered customer service training and conversation simulation. Now featuring a beautiful matcha/pistachio theme with glassmorphism effects and enhanced user experience.

## 🌟 Features

- 🎨 **Modern UI/UX** – Built with React 18, TypeScript, and Tailwind CSS with fresh matcha/pistachio design
- 💬 **Real-time Chat Interface** – Seamless conversation experience with Socket.io and agent avatars
- 🎤 **Voice Communication** – Integrated voice calls using LiveKit
- 📊 **Analytics Dashboard** – Comprehensive performance tracking and insights with enhanced visuals
- 🤖 **Agent Management** – Create and customize AI support agents with avatar upload
- 📱 **Responsive Design** – Mobile-first approach with elegant glassmorphism animations
- 🔐 **Secure Authentication** – JWT-based user authentication system
- 📈 **Real-time Updates** – Live conversation updates and notifications
- 👤 **Avatar System** – Visual agent representation with upload functionality
- 🌿 **Matcha Theme** – Calming nature-inspired design with accessibility focus

## ⚙️ Tech Stack

| Category        | Technology                                |
| --------------- | ----------------------------------------- |
| **Framework**   | React 18 with TypeScript                  |
| **Styling**     | Tailwind CSS with Headless UI components  |
| **Theme**       | Custom matcha/pistachio design system     |
| **Routing**     | React Router DOM v6                       |
| **State Mgmt**  | React Context API + Custom Hooks          |
| **Real-time**   | Socket.io Client, LiveKit Client          |
| **HTTP Client** | Axios for API communication               |
| **Charts**      | Chart.js with React wrapper               |
| **Icons**       | Heroicons                                 |
| **Build Tool**  | Create React App with Craco configuration |

## 🎨 Design System

### New Matcha/Pistachio Theme

The frontend has been completely redesigned with a fresh, modern aesthetic:

**Color Palette:**

- **Primary Matcha**: `#819A91` - Used for primary buttons and accents
- **Secondary Sage**: `#6B8A7A` - Used for hover states and secondary elements
- **Accent Pistachio**: `#A7C1A8` - Used for highlights and success states
- **Background Gradient**: `#F5F7F0` to `#E8F0E3` to `#EBFFD8` - Light, warm backgrounds
- **Text Dark Green**: `#2C3E2D` - Primary text color for excellent readability
- **Error Coral**: `#E07B67` - Muted coral for error states and warnings

**Design Features:**

- **Glassmorphism Effects**: Translucent elements with backdrop blur
- **Natural Colors**: Earth-tones inspired by matcha and pistachio
- **Smooth Animations**: Updated glow effects and gradient animations
- **High Contrast**: Excellent readability and accessibility
- **Mobile-First**: Responsive design that works beautifully on all devices

### Avatar System

- **Agent Avatars**: Each AI agent now has a visual avatar displayed in conversations
- **Upload Functionality**: Users can upload custom avatar images for their agents
- **Default Avatars**: Beautiful pre-designed avatars for built-in company agents
- **Responsive Display**: Avatars adapt seamlessly to different screen sizes

## 🛠 Project Structure

```
frontend/
├── public/                   # Static assets
│   ├── index.html            # Main HTML template
│   ├── favicon.ico           # App favicon
│   ├── manifest.json         # PWA manifest
│   └── avatars/              # Default agent avatars
├── src/
│   ├── components/           # Reusable React components
│   │   ├── Navbar.tsx        # Navigation bar with matcha theme
│   │   └── ProtectedRoute.tsx # Route protection with styled loading
│   ├── pages/                # Page components (all with new design)
│   │   ├── Dashboard.tsx     # User dashboard with matcha styling and glass cards
│   │   ├── Login.tsx         # Authentication page with new theme
│   │   ├── Register.tsx      # User registration with glassmorphism
│   │   ├── Agents.tsx        # Agent management with avatar support
│   │   ├── CreateAgent.tsx   # Agent creation form with avatar upload
│   │   ├── EditAgent.tsx     # Agent editing with avatar management
│   │   ├── AgentCall.tsx     # Voice call with agent and avatar display
│   │   ├── AgentHistory.tsx  # Agent conversation history with new design
│   │   ├── LiveCall.tsx      # Live voice call interface
│   │   ├── CallSimulator.tsx # Call simulation with enhanced UI
│   │   ├── Conversations.tsx # Conversation management with matcha theme
│   │   ├── ConversationList.tsx # List of conversations with new styling
│   │   └── ConversationDetail.tsx # Individual conversation view
│   ├── contexts/             # React contexts
│   │   ├── AuthContext.tsx   # User authentication state
│   │   └── LiveKitContext.tsx # Voice call state management
│   ├── types/                # TypeScript interfaces
│   │   ├── conversation.ts   # Conversation types
│   │   └── global.d.ts       # Global type definitions
│   ├── styles/               # CSS files and animations
│   │   ├── index.css         # Global styles with matcha theme
│   │   └── animations.css    # Updated glow effects and gradient animations
│   ├── App.tsx               # Main application component
│   ├── index.tsx             # React DOM entry point
│   └── App.test.tsx          # Application tests
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── craco.config.js           # Create React App configuration
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend server running on `http://localhost:5001`

### Process Cleanup Script

**⚠️ Important**: Before starting the project, run this cleanup script to avoid port conflicts:

```bash
# Kill all nodemon and Node.js processes
pkill -f "nodemon|react-scripts|ts-node"

# Or use specific port cleanup:
lsof -ti:3000 | xargs kill -9  # Kill frontend processes
```

### Installation

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   Create `.env` in the frontend directory:

   ```env
   REACT_APP_API_URL=http://localhost:5001
   REACT_APP_SOCKET_URL=http://localhost:5001
   REACT_APP_LIVEKIT_URL=wss://your-livekit-server.com
   ```

4. **Start development server**

   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`

   **Note**: You'll immediately notice the beautiful new matcha/pistachio theme with glassmorphism effects throughout the interface.

## 🎯 Key Components

### Authentication System

The frontend implements a complete authentication flow with the new design:

- **Login/Register**: User authentication with glassmorphism form design
- **Protected Routes**: Route guards for authenticated users with styled loading states
- **Token Management**: Automatic token refresh and storage
- **Context Provider**: Global authentication state management

### Chat Interface

Real-time chat functionality with enhanced visuals:

- **Message Display**: Threaded conversation view with agent avatars
- **Avatar Integration**: Visual agent representation in conversations
- **Typing Indicators**: Live typing status with matcha-themed animations
- **Sentiment Analysis**: Visual sentiment indicators with new color scheme
- **Message History**: Conversation persistence with beautiful styling
- **Agent Switching**: Dynamic agent selection with avatar preview

### Voice Communication

Integrated voice calling features with updated design:

- **LiveKit Integration**: Real-time voice communication
- **Audio Controls**: Microphone and speaker management with matcha styling
- **Participant Management**: Multi-user voice rooms with enhanced UI
- **Connection Status**: Real-time connection monitoring with new visual indicators

### Dashboard Analytics

Comprehensive analytics interface with glassmorphism design:

- **Performance Metrics**: Conversation statistics in beautiful glass cards
- **Charts and Graphs**: Visual data representation with matcha color scheme
- **Recent Activity**: Activity feed with enhanced readability
- **Progress Tracking**: User improvement metrics with modern styling

### Agent Management

Create and manage AI agents with avatar support:

- **Agent Creation**: Custom agent personality setup with avatar upload
- **Avatar Management**: Image upload with preview and validation
- **Personality Configuration**: Behavior and response settings in styled forms
- **Agent Testing**: Preview agent responses with avatar display
- **Visual Cards**: Beautiful agent cards with glassmorphism effects

## 🔧 Development

### Available Scripts

```bash
# Development
npm start              # Start development server
npm run build          # Build for production
npm run test           # Run tests
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
```

### Environment Variables

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5001          # Backend API URL
REACT_APP_SOCKET_URL=http://localhost:5001       # Socket.io server URL

# LiveKit Configuration
REACT_APP_LIVEKIT_URL=wss://your-livekit-server.com  # LiveKit server URL

# Optional Configuration
REACT_APP_DEBUG=true                             # Enable debug mode
REACT_APP_VERSION=$npm_package_version           # App version
```

### Code Style and Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration with custom rules
- **Prettier**: Consistent code formatting
- **Tailwind CSS**: Utility-first styling approach with custom matcha theme
- **Component Architecture**: Functional components with hooks
- **Design System**: Consistent use of matcha color palette and glassmorphism

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- App.test.tsx
```

## 🎨 UI/UX Design

### Design System Features

- **Matcha Color Palette**: Calming, nature-inspired colors
- **Glassmorphism**: Modern translucent design elements
- **Typography**: Clear, readable font hierarchy with dark green text
- **Spacing**: Consistent Tailwind CSS spacing scale
- **Components**: Reusable UI component library with matcha styling
- **Animations**: Smooth transitions and micro-interactions

### Accessibility

- **High Contrast**: Dark green text on light backgrounds for excellent readability
- **Color Blindness**: Accessible color combinations tested
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **Touch Targets**: Appropriately sized touch targets for mobile

### Responsive Design

- **Mobile-First**: Designed for mobile devices first
- **Breakpoints**: Tailwind CSS responsive breakpoints
- **Touch-Friendly**: Optimized for touch interactions
- **Fluid Layouts**: Adapts beautifully to all screen sizes

### Key UI Features

- **Loading States**: Skeleton screens and spinners with matcha styling
- **Error Handling**: User-friendly error messages with coral accents
- **Form Validation**: Real-time validation feedback with glassmorphism
- **Notifications**: Toast notifications with matcha color scheme
- **Avatar Displays**: Seamless avatar integration throughout the interface

## 🔍 Performance Optimization

### Bundle Optimization

- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Dynamic imports for heavy components
- **Tree Shaking**: Remove unused code
- **Image Optimization**: Optimized avatar and image loading

### Runtime Performance

- **React.memo**: Prevent unnecessary re-renders
- **useMemo/useCallback**: Optimize expensive computations
- **Virtual Scrolling**: Efficient large list rendering
- **Debouncing**: Optimize API calls and user input

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**

   ```bash
   # Clear cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Design/Styling Issues**

   ```bash
   # Clear browser cache if old styles persist
   # Check console for CSS compilation errors
   # Ensure Tailwind CSS classes are properly applied
   ```

3. **Avatar Upload Issues**

   - Check file size limits (default: 5MB)
   - Verify supported file formats (PNG, JPG, JPEG, GIF)
   - Ensure backend avatar endpoints are accessible

4. **Socket Connection Issues**

   ```bash
   # Check backend server is running
   curl http://localhost:5001/health

   # Verify environment variables
   echo $REACT_APP_SOCKET_URL
   ```

5. **LiveKit Connection Problems**

   - Verify LiveKit server is accessible
   - Check browser permissions for microphone
   - Ensure WebRTC is enabled in browser

6. **TypeScript Errors**

   ```bash
   # Run type checking
   npm run type-check

   # Fix common issues
   npm run lint:fix
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

### Agent Management API (Enhanced)

```typescript
// Get user agents
GET /api/agents

// Create agent with avatar
POST /api/agents
FormData: {
  "name": "Support Agent",
  "company": "TechCorp",
  "personality": "friendly",
  "avatar": File // Image file upload
}

// Update agent
PUT /api/agents/:id
{
  "name": "Updated Agent Name"
}

// Upload/update agent avatar
POST /api/agents/:id/avatar
FormData: {
  "avatar": File // Image file
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

// Get user statistics
GET /api/conversations/stats/user/:userId
```

## 🛣️ Future Enhancements

### Planned Features

- [ ] **Dark Mode Toggle**: Alternative to the matcha theme
- [ ] **PWA Features**: Offline support and push notifications
- [ ] **Advanced Analytics**: More detailed performance metrics with enhanced visuals
- [ ] **Multi-language**: Internationalization support
- [ ] **Custom Themes**: User-customizable color schemes
- [ ] **Export Features**: Conversation export functionality
- [ ] **Avatar AI Generation**: AI-powered avatar creation
- [ ] **Enhanced Accessibility**: Advanced screen reader support

### Technical Improvements

- [ ] **State Management**: Migrate to Redux Toolkit
- [ ] **Testing**: Increase test coverage to 90%+
- [ ] **Performance**: Implement service workers
- [ ] **Security**: Enhanced CSP and security headers
- [ ] **Monitoring**: Error tracking and analytics
- [ ] **Animation Library**: More sophisticated animations
- [ ] **Component Library**: Publish reusable component package

## 📖 Design Documentation

### Component Library

The frontend includes a comprehensive component library with:

- **Glass Cards**: Reusable glassmorphism containers
- **Matcha Buttons**: Consistent button styling with hover effects
- **Avatar Components**: Flexible avatar display components
- **Form Elements**: Styled inputs, selects, and textareas
- **Loading States**: Skeleton screens and spinners
- **Navigation**: Consistent navigation components

### Theme Customization

The matcha theme can be customized by modifying:

```css
/* Custom CSS variables in index.css */
:root {
  --matcha-primary: #819a91;
  --matcha-secondary: #6b8a7a;
  --matcha-accent: #a7c1a8;
  --matcha-background: #f5f7f0;
  --matcha-text: #2c3e2d;
  --matcha-error: #e07b67;
}
```

## 👨‍💻 Author

**Misbah Ahmed Nauman**

- 🌐 [Portfolio](https://misbahan.com)
- 🛠️ Built during Headstarter SWE Residency (Past Project)
