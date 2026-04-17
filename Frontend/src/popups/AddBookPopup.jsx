import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { X, BookPlus, Save } from "lucide-react";
import { toast } from "react-toastify";
import { addBook, updateBook, getAllBooks } from "../store/slices/bookSlice";

const AddBookPopup = ({ isOpen, onClose, bookToEdit }) => {
  const dispatch = useDispatch();
  
  // We grab loading, error, and message states from Redux
  const { loading, error, message } = useSelector((state) => state.books);

  // Form State
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

  // Auto-fill the form if we are editing an existing book
  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title || "");
      setAuthor(bookToEdit.author || "");
      setPrice(bookToEdit.price || "");
      setQuantity(bookToEdit.quantity || "");
      setDescription(bookToEdit.description || "");
    } else {
      // Clear the form if we are adding a new book
      setTitle("");
      setAuthor("");
      setPrice("");
      setQuantity("");
      setDescription("");
    }
  }, [bookToEdit, isOpen]);

  // Handle Redux success/error messages
  useEffect(() => {
    // Only run this if the popup is actually open
    if (!isOpen) return;

    if (error) {
      toast.error(error);
      // Optional: dispatch clear error action here if your slice has one
    }
    if (message) {
      toast.success(message);
      dispatch(getAllBooks()); // Refresh the book list!
      onClose(); // Close the popup
    }
  }, [dispatch, error, message, isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert price and quantity to numbers
    const bookData = { 
      title, 
      author, 
      price: Number(price), 
      quantity: Number(quantity), 
      description 
    };

    if (bookToEdit) {
      dispatch(updateBook(bookToEdit._id, bookData));
    } else {
      dispatch(addBook(bookData)); 
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            {bookToEdit ? <Save className="text-blue-600" size={20}/> : <BookPlus className="text-blue-600" size={20}/>}
            {bookToEdit ? "Edit Book Details" : "Add New Book"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              placeholder="e.g. The Great Gatsby"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
            <input 
              type="text" 
              value={author} 
              onChange={(e) => setAuthor(e.target.value)} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              placeholder="e.g. F. Scott Fitzgerald"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input 
                type="number" 
                min="0"
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Stock</label>
              <input 
                type="number" 
                min="0"
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)} 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                placeholder="Qty"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Synopsis / Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors h-24 custom-scrollbar resize-none" 
              placeholder="A brief summary of the book..."
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex gap-3 justify-end border-t border-gray-100 mt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-70 font-medium shadow-sm transition-colors"
            >
              {loading ? "Saving..." : (bookToEdit ? "Update Book" : "Add Book")}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AddBookPopup;