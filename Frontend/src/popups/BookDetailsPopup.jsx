import React from "react";
import { createPortal } from "react-dom";
import { X, BookOpen, User, Tag, IndianRupee } from "lucide-react";

const BookDetailsPopup = ({ book, onClose }) => {
  if (!book) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="text-blue-600" /> Book Details
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Left Column: Book Cover Placeholder */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-100 flex items-center justify-center shadow-inner">
                <BookOpen className="w-20 h-20 text-blue-300" />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-1"><IndianRupee size={14}/> Price</span>
                  <span className="font-bold text-gray-900">₹{book.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-1"><Tag size={14}/> Status</span>
                  <span className={`px-2 py-0.5 rounded-md font-bold ${book.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {book.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Available</span>
                  <span className="font-bold text-gray-900">{book.quantity} copies</span>
                </div>
              </div>
            </div>

            {/* Right Column: Book Info */}
            <div className="w-full md:w-2/3 space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-lg text-blue-600 font-medium flex items-center gap-2">
                  <User size={18} /> {book.author}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 border-b pb-1">Synopsis</h4>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                  {book.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
          
          {/* We will wire this up to Redux later! */}
          <button 
            disabled={book.quantity === 0}
            onClick={() => alert("Borrow functionality coming next!")}
            className="px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
          >
            {book.quantity === 0 ? "Unavailable" : "Borrow Book"}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default BookDetailsPopup;