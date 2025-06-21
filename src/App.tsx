import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CallSimulator from './pages/CallSimulator';
import Conversations from './pages/Conversations';
import ConversationDetail from './pages/ConversationDetail';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import Agents from './pages/Agents';
import CreateAgent from './pages/CreateAgent';
import EditAgent from './pages/EditAgent';
import AgentCall from './pages/AgentCall';
import AgentHistory from './pages/AgentHistory';
import { LiveKitProvider } from './contexts/LiveKitContext';
import LiveCall from './pages/LiveCall';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LiveKitProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/conversations" element={<ProtectedRoute><Conversations /></ProtectedRoute>} />
              <Route path="/conversations/:id" element={<ProtectedRoute><ConversationDetail /></ProtectedRoute>} />
              <Route path="/call-simulator" element={<ProtectedRoute><CallSimulator /></ProtectedRoute>} />
              <Route path="/live-call" element={<ProtectedRoute><LiveCall /></ProtectedRoute>} />
              <Route path="/live-call/:roomName" element={<ProtectedRoute><LiveCall /></ProtectedRoute>} />
              <Route path="/agents" element={<ProtectedRoute><Agents /></ProtectedRoute>} />
              <Route path="/agents/create" element={<ProtectedRoute><CreateAgent /></ProtectedRoute>} />
              <Route path="/agents/edit/:agentId" element={<ProtectedRoute><EditAgent /></ProtectedRoute>} />
              <Route path="/calls/:agentName" element={<AgentCall />} />
              <Route path="/history/:agentName" element={<AgentHistory />} />
            </Routes>
          </div>
        </Router>
      </LiveKitProvider>
    </AuthProvider>
  );
};

export default App;

