import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { X, ArrowDownToLine, Mail, Hash } from "lucide-react";
import { toast } from "react-toastify";
import { returnBorrowedBook, clearBorrowErrors, clearBorrowMessage, getAdminBorrowedBooks } from "../store/slices/borrowSlice";

const ReturnBookPopup = ({ isOpen, onClose, prefilledRecord }) => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.borrow);

  const [email, setEmail] = useState("");
  const [bookId, setBookId] = useState("");

  // If the admin clicked on a specific record, pre-fill the form!
  useEffect(() => {
    if (prefilledRecord) {
      setEmail(prefilledRecord.user?.email || "");
      setBookId(prefilledRecord.book || "");
    }
  }, [prefilledRecord]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearBorrowErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(clearBorrowMessage());
      dispatch(getAdminBorrowedBooks()); // Refresh admin stats
      setEmail("");
      setBookId("");
      onClose();
    }
  }, [dispatch, error, message, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !bookId) {
      toast.error("User Email and Book ID are required.");
      return;
    }
    // Dispatch to the backend route
    dispatch(returnBorrowedBook(bookId, email));
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <ArrowDownToLine className="text-green-600" /> Process Book Return
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-sm text-green-800">
            Process a return to add the book back to inventory and automatically calculate any overdue fines.
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User's Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="member@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Book ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-colors font-mono text-sm"
                placeholder="Paste Book ID (e.g. 64b1f...)"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex gap-3 justify-end border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
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