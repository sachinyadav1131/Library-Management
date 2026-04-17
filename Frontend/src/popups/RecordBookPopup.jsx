import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { X, BookCheck, Mail } from "lucide-react";
import { toast } from "react-toastify";
import { recordBorrowBook, clearBorrowErrors, clearBorrowMessage } from "../store/slices/borrowSlice";
import { getAllBooks } from "../store/slices/bookSlice";

const RecordBookPopup = ({ isOpen, onClose, book }) => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.borrow);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearBorrowErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(clearBorrowMessage());
      dispatch(getAllBooks()); // Refresh the catalog to update stock numbers
      setEmail(""); // Clear input
      onClose(); // Close the popup
    }
  }, [dispatch, error, message, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("User email is required");
      return;
    }
    // Issue the book to the user's email
    dispatch(recordBorrowBook(book._id, email));
  };

  if (!isOpen || !book) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <BookCheck className="text-blue-600" /> Issue Book to User
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
            <p className="text-sm text-blue-800">
              You are issuing <span className="font-bold">"{book.title}"</span>. This will decrease the stock by 1 and assign it to the member's account.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User's Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="member@example.com"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex gap-3 justify-end border-t border-gray-100 mt-6">
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
              className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-70 font-medium"
            >
              {loading ? "Issuing..." : "Confirm Issue"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default RecordBookPopup;