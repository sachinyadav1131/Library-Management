import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { X, ArrowDownToLine, Search, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import { returnBorrowedBook, clearBorrowErrors, clearBorrowMessage, getAdminBorrowedBooks } from "../store/slices/borrowSlice";

const ReturnBookPopup = ({ isOpen, onClose, prefilledRecord }) => {
  const dispatch = useDispatch();
  
  const { loading, error, message, borrowedBooks } = useSelector((state) => state.borrow);
  const { books } = useSelector((state) => state.books);

  // States for our custom searchable dropdown
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null); // Will hold { bookId, email }

  // Ref to handle clicking outside the dropdown to close it
  const dropdownRef = useRef(null);

  // 1. Map all active borrows to include the Book Title for easy searching
  const activeBorrows = borrowedBooks?.filter((b) => !b.returnDate).map((record) => {
    const matchedBook = books.find((b) => b._id === record.book);
    const title = matchedBook ? matchedBook.title : "Unknown Book";
    return {
      ...record,
      title,
      displayString: `${title} — (${record.user?.email})`
    };
  }) || [];

  // 2. Filter the list based on what the Admin types in the search bar
  const filteredOptions = activeBorrows.filter(record => 
    record.displayString.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Pre-filling when Admin clicks "Quick Return" from the dashboard
  useEffect(() => {
    if (prefilledRecord) {
      const matchedBook = books.find((b) => b._id === prefilledRecord.book);
      const title = matchedBook ? matchedBook.title : "Unknown Book";
      
      setSearchTerm(`${title} — (${prefilledRecord.user?.email})`);
      setSelectedData({ bookId: prefilledRecord.book, email: prefilledRecord.user?.email });
    } else {
      setSearchTerm("");
      setSelectedData(null);
    }
  }, [prefilledRecord, books, isOpen]);

  // Handle Redux Success/Error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearBorrowErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(clearBorrowMessage());
      dispatch(getAdminBorrowedBooks()); // Refresh admin stats
      setSearchTerm("");
      setSelectedData(null);
      onClose();
    }
  }, [dispatch, error, message, onClose]);

  // Close dropdown if Admin clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedData) {
      toast.error("Please select a valid book from the dropdown list.");
      return;
    }
    dispatch(returnBorrowedBook(selectedData.bookId, selectedData.email));
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <ArrowDownToLine className="text-green-600" /> Process Book Return
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-visible">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-sm text-green-800">
            Search for the book by Title or the User's Email address to process the return.
          </div>

          <div ref={dropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Borrowed Book</label>
            
            {/* SEARCH INPUT */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-sm"
                placeholder="Type book title or user email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedData(null); // Clear selection if they start typing again
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* CUSTOM DROPDOWN LIST */}
            {isDropdownOpen && (
              <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <li 
                      key={option._id}
                      className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                      onClick={() => {
                        setSearchTerm(option.displayString);
                        setSelectedData({ bookId: option.book, email: option.user?.email });
                        setIsDropdownOpen(false);
                      }}
                    >
                      <div className="font-bold text-gray-800 text-sm">{option.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Issued to: <span className="font-medium text-green-700">{option.user?.email}</span></div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-4 text-sm text-gray-500 text-center">
                    No matching records found.
                  </li>
                )}
              </ul>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              Showing {filteredOptions.length} of {activeBorrows.length} active borrows.
            </p>
          </div>

          {/* Form Actions */}
          <div className="pt-8 flex gap-3 justify-end border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedData}
              className="px-6 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-70 font-medium shadow-sm"
            >
              {loading ? "Processing..." : "Confirm Return"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ReturnBookPopup;