import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { X, BookPlus, Save, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";
import { addBook, updateBook, getAllBooks, clearBookErrors, clearBookMessage } from "../store/slices/bookSlice";

const AddBookPopup = ({ isOpen, onClose, bookToEdit }) => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.books);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  
  // 👈 New states for the image
  const [frontCover, setFrontCover] = useState("");
  const [frontCoverPreview, setFrontCoverPreview] = useState("");
  const [bookPdf, setBookPdf] = useState("");

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title || "");
      setAuthor(bookToEdit.author || "");
      setPrice(bookToEdit.price || "");
      setQuantity(bookToEdit.quantity || "");
      setDescription(bookToEdit.description || "");
      
      // If editing, show existing cover if it exists
      if(bookToEdit.frontCover?.url) {
        setFrontCoverPreview(bookToEdit.frontCover.url);
      }
    } else {
      setTitle("");
      setAuthor("");
      setPrice("");
      setQuantity("");
      setDescription("");
      setFrontCover("");
      setFrontCoverPreview("");
    }
  }, [bookToEdit, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (error) {
      toast.error(error, { toastId: error });
      dispatch(clearBookErrors());
    }
    if (message) {
      toast.success(message, { toastId: message });
      dispatch(clearBookMessage());
      dispatch(getAllBooks());
      onClose();
    }
  }, [dispatch, error, message, isOpen, onClose]);

  // 👈 Function to handle the image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFrontCover(file);
      setFrontCoverPreview(URL.createObjectURL(file)); // Creates a local temporary URL for preview
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBookPdf(file);
    }
  };

const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData instead of JSON!
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("price", Number(price));
    formData.append("quantity", Number(quantity));
    formData.append("description", description);
    
    // Only append the image if the Admin actually selected a new one
    if (frontCover) {
      formData.append("frontCover", frontCover);
    }

    // 👇 ADD THIS MISSING BLOCK!
    // Append the PDF if the Admin selected one
    if (bookPdf) {
      formData.append("bookPdf", bookPdf);
    }
    // 👆 =======================

    if (bookToEdit) {
      dispatch(updateBook(bookToEdit._id, formData));
    } else {
      dispatch(addBook(formData)); 
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            {bookToEdit ? <Save className="text-blue-600" size={20}/> : <BookPlus className="text-blue-600" size={20}/>}
            {bookToEdit ? "Edit Book Details" : "Add New Book"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          
          {/* 🖼️ IMAGE UPLOAD AREA */}
          <div className="col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-2">Front Cover Image</label>
            <div className="flex items-center gap-4">
              {frontCoverPreview ? (
                <img src={frontCoverPreview} alt="Cover Preview" className="w-16 h-24 object-cover rounded shadow-sm border border-gray-300" />
              ) : (
                <div className="w-16 h-24 bg-white border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400">
                  <ImageIcon size={24} />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition-colors cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-2">Complete Book PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setBookPdf(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-100 file:text-red-700 hover:file:bg-red-200 transition-colors cursor-pointer"
            />
            {bookToEdit?.bookPdf?.url && !bookPdf && (
              <p className="text-xs text-green-600 mt-2 font-medium">✓ A PDF is already attached to this book.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Stock</label>
              <input type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 h-24 resize-none" />
          </div>

          <div className="pt-4 flex gap-3 justify-end border-t border-gray-100 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-70 font-medium">
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