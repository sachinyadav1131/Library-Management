import React from "react";
import { useSelector } from "react-redux";
import { FaUserCircle, FaSearch, FaBell, FaBars } from "react-icons/fa";

// Accept setIsSideBarOpen as a prop so we can toggle the sidebar from the header!
const Header = ({ setIsSideBarOpen }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 shadow-sm w-full">
      
      {/* ========================================== */}
      {/* LEFT SIDE: Hamburger & Search/Title          */}
      {/* ========================================== */}
      <div className="flex items-center gap-4 flex-1">
        
        {/* Mobile Hamburger Button (Visible only on small screens) */}
        <button
          onClick={() => setIsSideBarOpen && setIsSideBarOpen(true)}
          className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 rounded-md focus:outline-none transition-colors"
        >
          <FaBars className="w-5 h-5" />
        </button>

        {/* Mobile Title (Visible only when search is hidden) */}
        <div className="sm:hidden font-bold text-lg text-blue-900 truncate">
          Library MS
        </div>

        {/* Desktop Search Bar (Hidden on mobile) */}
        <div className="hidden sm:flex items-center w-full max-w-md">
          <div className="relative w-full">
            {/* Added pointer-events-none so the icon doesn't block clicks! */}
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400 w-4 h-4" />
            </span>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
              placeholder="Search for books, authors, or ISBN..."
            />
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* RIGHT SIDE: Actions & User Profile           */}
      {/* ========================================== */}
      {/* Added flex-shrink-0 so the search bar doesn't squish the buttons */}
      <div className="flex items-center space-x-3 sm:space-x-6 flex-shrink-0">
        
        {/* Notifications Icon */}
        <button className="text-gray-500 hover:text-blue-600 transition-colors relative p-2 rounded-full hover:bg-gray-50">
          <FaBell className="w-5 h-5" />
          {/* Added pointer-events-none to the dot */}
          <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white pointer-events-none"></span>
        </button>

        {/* Vertical Divider */}
        <div className="hidden sm:block h-8 w-px bg-gray-200"></div>

        {/* User Info (Clickable Block) */}
        <div className="flex items-center gap-3 cursor-pointer p-1 pr-2 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-800 leading-none">
              {user?.name || "Guest User"}
            </p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
              {user?.role || "Member"}
            </p>
          </div>
          
          <div className="relative">
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt="profile"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border-2 border-blue-500 p-0.5 object-cover"
              />
            ) : (
              <FaUserCircle className="h-9 w-9 sm:h-10 sm:w-10 text-gray-400 hover:text-blue-500 transition-colors" />
            )}
            
            {/* Status Dot */}
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-500 border-2 border-white pointer-events-none"></span>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;