import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookMarked, Clock, CheckCircle, AlertCircle, Calendar, BookOpen } from "lucide-react";

// Import your existing ReadBookPopup and the getAllBooks action
import ReadBookPopup from "../popups/ReadBookPopup"; 
import { getAllBooks } from "../store/slices/bookSlice";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();

  // Grab BOTH user and books from the Redux store
  const { user } = useSelector((state) => state.auth);
  const { books } = useSelector((state) => state.books);
  
  // State to track which book the user wants to read
  const [bookToRead, setBookToRead] = useState(null);
  
  // Fetch books on mount so we have the full data (including PDFs) loaded
  useEffect(() => {
    dispatch(getAllBooks());
  }, [dispatch]);

  const borrowedBooks = user?.borrowedBooks || [];

  // Sort books so that currently borrowed/overdue books are at the top
  const sortedBooks = [...borrowedBooks].sort((a, b) => {
    if (a.returned === b.returned) {
      return new Date(b.dueDate) - new Date(a.dueDate); 
    }
    return a.returned ? 1 : -1; 
  });

  const getStatusBadge = (returned, dueDate) => {
    if (returned) {
      return (
        <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
          <CheckCircle size={14} /> Returned
        </span>
      );
    }
    if (new Date() > new Date(dueDate)) {
      return (
        <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit animate-pulse">
          <AlertCircle size={14} /> Overdue
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
        <Clock size={14} /> Borrowed
      </span>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      
      {/* Header Section */}
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BookMarked className="text-blue-600" /> My Reading History
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Track your current borrowed books and past reads.
        </p>
      </div>

      {/* Borrowed Books List */}
      <div className="space-y-4">
        {sortedBooks.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <BookMarked className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No books borrowed yet</h3>
            <p className="mt-1 text-gray-500 text-sm">
              Head over to the Catalog to find your first read!
            </p>
          </div>
        ) : (
          sortedBooks.map((record) => (
            <div 
              key={record._id} 
              className={`p-5 rounded-xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                !record.returned && new Date() > new Date(record.dueDate)
                  ? 'bg-red-50/30 border-red-100' 
                  : 'bg-white border-gray-100 hover:border-blue-100 hover:shadow-md'
              }`}
            >
              {/* Left Side: Book Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-16 bg-gradient-to-br from-blue-100 to-indigo-50 rounded shadow-sm flex items-center justify-center flex-shrink-0 border border-blue-100/50">
                  <BookMarked className="text-blue-300 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg line-clamp-1">{record.bookTitle}</h4>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="font-medium text-gray-500">Borrowed:</span> 
                      {new Date(record.borrowedDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-gray-400" />
                      <span className="font-medium text-gray-500">Due:</span> 
                      <span className={!record.returned && new Date() > new Date(record.dueDate) ? 'text-red-600 font-bold' : ''}>
                        {new Date(record.dueDate).toLocaleDateString()}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Status Badge & Actions */}
              <div className="flex flex-col items-end justify-center gap-3">
                {getStatusBadge(record.returned, record.dueDate)}
                
                {/* Notice for overdue books */}
                {!record.returned && new Date() > new Date(record.dueDate) && (
                  <span className="text-xs text-red-500 font-medium">
                    Please return this book to avoid fines.
                  </span>
                )}

                {/* Read Now Button (Only visible if the book is actively borrowed) */}
                {/* Read Now Button */}
                {!record.returned && (
                  <button 
                    onClick={() => {
                      // 🚀 THE BULLETPROOF SEARCH
                      // Try to find the book by ID first, but if that fails, match it by the Title!
                      const fullBookData = books?.find((b) => 
                        String(b._id) === String(record.book) || 
                        String(b._id) === String(record.bookId) ||
                        b.title?.toLowerCase() === record.bookTitle?.toLowerCase()
                      );
                      
                      if (fullBookData && fullBookData.bookPdf) {
                        setBookToRead(fullBookData); 
                      } else if (fullBookData) {
                        // We found the book, but the Admin genuinely hasn't uploaded a PDF yet
                        setBookToRead(fullBookData);
                      } else {
                        // If it STILL can't find it, the books haven't finished loading from the backend yet
                        alert("Still loading book data... Please wait a second and try again!");
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <BookOpen size={16} /> Read Now
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* Safely render the ReadBookPopup at the bottom of the component */}
      <ReadBookPopup 
        isOpen={!!bookToRead} // Converts the object to true/false
        onClose={() => setBookToRead(null)} 
        book={bookToRead} 
      />

    </div>
  );
};

export default MyBorrowedBooks;