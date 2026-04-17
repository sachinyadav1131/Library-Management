import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Trash2, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import { getAllBooks, deleteBook, clearBookErrors, clearBookMessage } from "../store/slices/bookSlice";
import AddBookPopup from "../popups/AddBookPopup";

const BookManagement = () => {
  const dispatch = useDispatch();
  const { books, loading, error, message } = useSelector((state) => state.books);
  
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);

  // Fetch books on mount
  useEffect(() => {
    dispatch(getAllBooks());
  }, [dispatch]);

  // Handle success/error messages & refresh list
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearBookErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(clearBookMessage());
      dispatch(getAllBooks()); // Refresh the list after add/delete
      setIsAddPopupOpen(false); // Close popup if open
    }
  }, [dispatch, error, message]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      dispatch(deleteBook(id));
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="text-blue-600" /> Book Inventory
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage library catalog and stock</p>
        </div>
        <button
          onClick={() => setIsAddPopupOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm"
        >
          <Plus size={18} /> Add New Book
        </button>
      </div>

      {/* Books Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title & Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && books.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading books...</td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No books found in the library. Click 'Add New Book' to start.</td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{book.title}</div>
                    <div className="text-sm text-gray-500">{book.author}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                    {book.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{book.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      book.quantity > 5 ? 'bg-green-100 text-green-800' : 
                      book.quantity > 0 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {book.quantity} Left
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button 
                      onClick={() => handleDelete(book._id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* The Popup Component */}
      <AddBookPopup 
        isOpen={isAddPopupOpen} 
        onClose={() => setIsAddPopupOpen(false)} 
      />
    </div>
  );
};

export default BookManagement;