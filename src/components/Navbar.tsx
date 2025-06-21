import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white/90 backdrop-blur-lg border-b border-[#819A91]/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className="text-xl font-bold text-[#2C3E2D] hover:text-[#819A91] transition-colors"
              >
                CustomerCare VoiceAI
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className={`${
                  location.pathname === "/dashboard"
                    ? "text-[#819A91] border-[#819A91]"
                    : "text-[#5A6B5B] hover:text-[#2C3E2D] border-transparent hover:border-[#819A91]/20"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Dashboard
              </Link>
              <Link
                to="/conversations"
                className={`${
                  location.pathname === "/conversations"
                    ? "text-[#819A91] border-[#819A91]"
                    : "text-[#5A6B5B] hover:text-[#2C3E2D] border-transparent hover:border-[#819A91]/20"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Conversations
              </Link>
              <Link
                to="/agents"
                className={`${
                  location.pathname === "/agents"
                    ? "text-[#819A91] border-[#819A91]"
                    : "text-[#5A6B5B] hover:text-[#2C3E2D] border-transparent hover:border-[#819A91]/20"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Agents
              </Link>
              <Link
                to="/live-call"
                className={`${
                  location.pathname.startsWith("/live-call")
                    ? "text-[#819A91] border-[#819A91]"
                    : "text-[#5A6B5B] hover:text-[#2C3E2D] border-transparent hover:border-[#819A91]/20"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Live Call
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#A7C1A8]/20 flex items-center justify-center mr-2">
                    <span className="text-[#819A91] font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[#5A6B5B]">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-[#5A6B5B] hover:text-[#2C3E2D] bg-[#E07B67]/10 hover:bg-[#E07B67]/20 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-[#5A6B5B] hover:text-[#2C3E2D] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#819A91] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#6B8A7A] transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
