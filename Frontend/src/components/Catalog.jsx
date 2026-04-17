import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Library, BookOpen } from "lucide-react";
import { getAllBooks } from "../store/slices/bookSlice";
import BookDetailsPopup from "../popups/BookDetailsPopup";

const Catalog = () => {
  const dispatch = useDispatch();
  const { books, loading } = useSelector((state) => state.books);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  // Fetch all books when the component loads
  useEffect(() => {
    dispatch(getAllBooks());
  }, [dispatch]);

  // Real-time filtering logic
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header & Search Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Library className="text-blue-600" /> Library Catalog
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Browse and search our entire collection
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Book Grid */}
      {loading && books.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No books found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
            >
              {/* Book Cover Placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-100 flex items-center justify-center p-6 relative">
                <BookOpen className="w-16 h-16 text-blue-200 group-hover:scale-110 transition-transform duration-300" />
                {/* Stock Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded-md shadow-sm ${
                      book.quantity > 5
                        ? "bg-green-500 text-white"
                        : book.quantity > 0
                          ? "bg-yellow-500 text-white"
                          : "bg-red-500 text-white"
                    }`}
                  >
                    {book.quantity > 0
                      ? `${book.quantity} in stock`
                      : "Out of stock"}
                  </span>
                </div>
              </div>

              {/* Book Details */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className="text-lg font-bold text-gray-900 line-clamp-1"
                    title={book.title}
                  >
                    {book.title}
                  </h3>
                </div>
                <p className="text-sm font-medium text-blue-600 mb-3">
                  {book.author}
                </p>

                <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
                  {book.description}
                </p>

                {/* Footer of Card */}
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-auto">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{book.price}
                  </span>
                  <button
                    onClick={() => setSelectedBook(book)} // 👈 ADD THIS ONCLICK
                    disabled={book.quantity === 0}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <BookDetailsPopup 
        book={selectedBook} 
        onClose={() => setSelectedBook(null)} 
      />
    </div>
  );
};

export default Catalog;
