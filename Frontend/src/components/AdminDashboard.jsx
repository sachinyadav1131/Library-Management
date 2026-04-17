import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaBook, FaUsers, FaExchangeAlt, FaExclamationTriangle } from "react-icons/fa";
import { ArrowDownToLine } from "lucide-react"; // 👈 Added icon for the button

// Import your Redux Thunks
import { getAllBooks } from "../store/slices/bookSlice";
import { getAllUsers } from "../store/slices/userSlice";
import { getAdminBorrowedBooks } from "../store/slices/borrowSlice";

// Import the Popup
import ReturnBookPopup from "../popups/ReturnBookPopup"; // 👈 Added Popup Import

const AdminDashboard = () => {
  const dispatch = useDispatch();

  // State for the Return Popup
  const [isReturnPopupOpen, setIsReturnPopupOpen] = useState(false);
  const [prefilledRecord, setPrefilledRecord] = useState(null);

  // Grab live data from Redux Store
  const { books } = useSelector((state) => state.books);
  const { users } = useSelector((state) => state.users);
  const { borrowedBooks } = useSelector((state) => state.borrow);

  // Fetch all required data on component mount
  useEffect(() => {
    dispatch(getAllBooks());
    dispatch(getAllUsers());
    dispatch(getAdminBorrowedBooks());
  }, [dispatch]);

  // ==========================================
  // REAL-TIME DATA CALCULATIONS
  // ==========================================
  
  const totalBooks = books?.length || 0;
  const totalUsers = users?.length || 0;

  // Active borrows are those that do not have a returnDate yet
  const activeBorrows = borrowedBooks?.filter((b) => !b.returnDate) || [];
  
  // Overdue borrows are active borrows where today's date is past the dueDate
  const overdueBorrows = activeBorrows.filter(
    (b) => new Date() > new Date(b.dueDate)
  );

  // Stats Array for Grid Rendering
  const stats = [
    { label: "Total Books", value: totalBooks, icon: <FaBook />, color: "bg-blue-500" },
    { label: "Active Borrows", value: activeBorrows.length, icon: <FaExchangeAlt />, color: "bg-green-500" },
    { label: "Total Users", value: totalUsers, icon: <FaUsers />, color: "bg-purple-500" },
    { label: "Overdue Books", value: overdueBorrows.length, icon: <FaExclamationTriangle />, color: "bg-red-500" },
  ];

  // Get Top 4 most recent borrowings (sorting by newest first)
  const recentActivity = [...(borrowedBooks || [])]
    .sort((a, b) => new Date(b.createdAt || b.dueDate) - new Date(a.createdAt || a.dueDate))
    .slice(0, 4);

  // Helper to open the return popup
  const openReturnPopup = (record = null) => {
    setPrefilledRecord(record);
    setIsReturnPopupOpen(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow">
            <div className={`${stat.color} p-4 rounded-lg text-white mr-4 text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Borrowings List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          
          {/* 👈 MODIFIED HEADER: Added the Process Return Button here */}
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-bold text-gray-800">Recent Borrowings</h3>
            <button 
              onClick={() => openReturnPopup(null)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
            >
              <ArrowDownToLine size={16} /> Process Return
            </button>
          </div>

          <div className="space-y-4 flex-1">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">No borrowing history found.</p>
            ) : (
              recentActivity.map((item) => {
                const matchedBook = books.find((b) => b._id === item.book);
                const bookTitle = matchedBook ? matchedBook.title : "Unknown Book";
                const isReturned = !!item.returnDate; // Check if already returned

                return (
                  <div key={item._id} className="flex items-center justify-between text-sm py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors px-2 rounded-lg group">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 line-clamp-1">{bookTitle}</span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        Issued to: <span className="font-medium text-blue-600">{item.user?.name}</span>
                      </span>
                    </div>
                    
                    {/* Status / Action Area */}
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full font-medium text-xs ${isReturned ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-600'}`}>
                        {isReturned ? 'Returned' : `${new Date(item.dueDate).toLocaleDateString()} (Due)`}
                      </span>
                      
                      {/* 👈 Quick Return Button for Active Books */}
                      {!isReturned && (
                        <button 
                          onClick={() => openReturnPopup(item)}
                          title="Quick Return"
                          className="p-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <ArrowDownToLine size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Overdue Alerts Panel */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Overdue Alerts</h3>
          <div className="space-y-4">
            
            {overdueBorrows.length === 0 ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-3 border border-green-100">
                <span className="text-xl">🎉</span>
                <div>
                  <p className="font-bold text-sm">All clear!</p>
                  <p className="text-xs mt-0.5">No books are currently overdue.</p>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start border border-red-100 animate-pulse">
                <FaExclamationTriangle className="mt-1 mr-3 flex-shrink-0 text-red-500" size={20} />
                <div>
                  <p className="font-bold text-sm">{overdueBorrows.length} Books are significantly overdue!</p>
                  <p className="text-xs mt-1 text-red-600">
                    Check the borrowing history to find out which users haven't returned their books.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* 👈 THE POPUP RENDERER */}
      <ReturnBookPopup 
        isOpen={isReturnPopupOpen} 
        onClose={() => setIsReturnPopupOpen(false)} 
        prefilledRecord={prefilledRecord}
      />
    </div>
  );
};

export default AdminDashboard;