import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { createRequest, clearErrors, clearMessage } from "../store/slices/requestSlice"; 
import { toast } from "react-toastify";

const BookDetailsPopup = ({ book, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // 👈 Get message and error from the requests slice
  const { loading, error, message } = useSelector((state) => state.requests); 

  const handleBorrowRequest = () => {
    if (!user) {
      return toast.error("Please login to request a book");
    }
    dispatch(createRequest(book._id));
  };

  // 👈 Monitor the request status
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
      onClose(); // Close the popup automatically on success
    }
  }, [dispatch, error, message, onClose]);

  if (!book) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative flex flex-col md:flex-row">
        
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-red-50 hover:text-red-600 transition-all shadow-md">
          <X size={20} />
        </button>

        <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-8">
          <img src={book.image?.url} alt={book.title} className="w-full max-w-[220px] rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500" />
        </div>

        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-blue-700 mb-4">
              {book.category}
            </span>
            <h2 className="text-3xl font-black text-gray-900 leading-tight mb-2">{book.title}</h2>
            <p className="text-gray-500 italic mb-6">by <span className="text-gray-800 font-semibold">{book.author}</span></p>
            
            <div className="space-y-4 mb-8">
              <p className="text-gray-600 text-sm leading-relaxed">{book.description}</p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Price</p>
                  <p className="text-xl font-bold text-green-600">₹{book.price}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">In Stock</p>
                  <p className="text-xl font-bold text-gray-800">{book.quantity} copies</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            {user?.role === "Admin" ? (
              <p className="text-sm text-gray-400 italic text-center">Admins manage inventory via Dashboard</p>
            ) : (
              <button
                onClick={handleBorrowRequest}
                disabled={loading || book.quantity === 0}
                className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                  book.quantity > 0 
                  ? "bg-gray-900 text-white hover:bg-black" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? "Processing..." : book.quantity > 0 ? "Request to Borrow" : "Out of Stock"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPopup;