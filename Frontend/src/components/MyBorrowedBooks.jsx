import React from "react";
import { useSelector } from "react-redux";
import { BookMarked, Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react";

const MyBorrowedBooks = () => {
  // Grab the user directly from the auth store
  const { user } = useSelector((state) => state.auth);
  
  // Default to empty array if undefined
  const borrowedBooks = user?.borrowedBooks || [];

  // Sort books so that currently borrowed/overdue books are at the top
  const sortedBooks = [...borrowedBooks].sort((a, b) => {
    if (a.returned === b.returned) {
      return new Date(b.dueDate) - new Date(a.dueDate); // Newest first
    }
    return a.returned ? 1 : -1; // Unreturned books bubble to the top
  });

  // Helper function to generate the correct status badge
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

              {/* Right Side: Status Badge */}
              <div className="flex flex-col items-end justify-center">
                {getStatusBadge(record.returned, record.dueDate)}
                
                {/* Notice for overdue books */}
                {!record.returned && new Date() > new Date(record.dueDate) && (
                  <span className="text-xs text-red-500 mt-2 font-medium">
                    Please return this book to avoid fines.
                  </span>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default MyBorrowedBooks;