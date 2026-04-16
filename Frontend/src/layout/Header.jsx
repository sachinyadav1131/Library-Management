import React from "react";
import { useSelector } from "react-redux";
import { FaUserCircle, FaSearch, FaBell } from "react-icons/fa";

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shadow-sm">
      
      {/* Left side: Search Bar (Hidden on small mobile) */}
      <div className="hidden sm:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch className="text-gray-400 w-4 h-4" />
          </span>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
            placeholder="Search for books, authors, or ISBN..."
          />
        </div>
      </div>

      {/* Mobile Title (Visible only when search is hidden) */}
      <div className="sm:hidden font-bold text-lg text-blue-900">
        Library MS
      </div>

      {/* Right side: Actions & User Profile */}
      <div className="flex items-center space-x-4 md:space-x-6">
        
        {/* Notifications Icon */}
        <button className="text-gray-500 hover:text-blue-600 transition-colors relative">
          <FaBell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
        </button>

        {/* Vertical Divider */}
        <div className="h-8 w-px bg-gray-200"></div>

        {/* User Info */}
        <div className="flex items-center group cursor-pointer">
          <div className="text-right mr-3 hidden md:block">
            <p className="text-sm font-semibold text-gray-800 leading-none">
              {user?.name || "Guest User"}
            </p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
              {user?.role || "Member"}
            </p>
          </div>
          
          <div className="relative">
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt="profile"
                className="h-10 w-10 rounded-full border-2 border-blue-500 p-0.5 object-cover"
              />
            ) : (
              <FaUserCircle className="h-10 w-10 text-gray-400 group-hover:text-blue-500 transition-colors" />
            )}
            
            {/* Status Dot */}
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;