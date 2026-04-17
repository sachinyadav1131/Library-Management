import React from "react";
import { createPortal } from "react-dom";
import { X, BookOpen, ChevronRight, ChevronLeft } from "lucide-react";

const ReadBookPopup = ({ isOpen, onClose, bookTitle }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 animate-fadeIn">
      <div className="bg-[#f9f6ee] rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden relative">
        
        {/* Top Header / Toolbar */}
        <div className="px-6 py-3 flex justify-between items-center bg-[#f0ebd8] border-b border-[#e2d5b8] shadow-sm z-10">
          <h3 className="text-lg font-serif font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="text-gray-600" size={20} /> 
            {bookTitle || "Reading Mode"}
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-sm font-serif text-gray-500">Page 1 of 342</span>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-red-600 transition-colors p-1 bg-white rounded-md shadow-sm border border-[#e2d5b8]"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* E-Reader Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative px-8 md:px-24 py-12">
          
          <div className="max-w-2xl mx-auto font-serif text-lg text-gray-800 leading-loose tracking-wide">
            <h1 className="text-4xl text-center mb-12 font-bold text-gray-900 border-b border-gray-300 pb-6">
              {bookTitle}
            </h1>
            
            <p className="mb-6 indent-12">
              The sky above the port was the color of television, tuned to a dead channel. 
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="mb-6 indent-12">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
              culpa qui officia deserunt mollit anim id est laborum. Pellentesque habitant 
              morbi tristique senectus et netus et malesuada fames ac turpis egestas.
            </p>
            <p className="mb-6 indent-12">
              Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, 
              turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis 
              sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus 
              et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut 
              ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt 
              sapien risus a quam.
            </p>

            <div className="mt-20 text-center text-sm text-gray-400 italic border-t border-gray-200 pt-8">
              (This is a simulated reading environment. PDF integration would render actual pages here.)
            </div>
          </div>
        </div>

        {/* Page Navigation Overlay */}
        <button className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/50 hover:bg-white rounded-full shadow-md text-gray-600 transition-all">
          <ChevronLeft size={24} />
        </button>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/50 hover:bg-white rounded-full shadow-md text-gray-600 transition-all">
          <ChevronRight size={24} />
        </button>

      </div>
    </div>,
    document.body
  );
};

export default ReadBookPopup;