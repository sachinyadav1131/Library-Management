import React from "react";
import { useSelector } from "react-redux";
import { BookOpen, Clock, AlertTriangle, Library, Calendar } from "lucide-react";

const UserDashboard = () => {
  // Grab the logged-in user from Redux
  const { user } = useSelector((state) => state.auth);

  // Safely get the borrowed books array
  const borrowedBooks = user?.borrowedBooks || [];

  // Calculate real-time stats for this specific user
  const totalBorrowed = borrowedBooks.length;
  const activeBorrows = borrowedBooks.filter((b) => !b.returned).length;
  const overdueBooks = borrowedBooks.filter(
    (b) => !b.returned && new Date() > new Date(b.dueDate)
  ).length;

  // Get the 3 most recent activities for the quick-view feed
  const recentActivity = [...borrowedBooks]
    .sort((a, b) => new Date(b.borrowedDate) - new Date(a.borrowedDate))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Reader'}! 👋
          </h1>
          <p className="text-blue-100 max-w-lg">
            Ready to dive into your next adventure? Check out the catalog for new arrivals, or review your current reading list below.
          </p>
        </div>
        {/* Decorative Background Icon */}
        <Library className="absolute -bottom-6 -right-6 w-48 h-48 text-white opacity-10 transform -rotate-12" />
      </div>

      {/* User Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="bg-blue-100 p-4 rounded-lg text-blue-600 mr-4">
            <Library size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Read</p>
            <h3 className="text-2xl font-bold text-gray-800">{totalBorrowed} Books</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="bg-green-100 p-4 rounded-lg text-green-600 mr-4">
            <BookOpen size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Currently Reading</p>
            <h3 className="text-2xl font-bold text-gray-800">{activeBorrows} Books</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className={`p-4 rounded-lg mr-4 ${overdueBooks > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
            <AlertTriangle size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Overdue</p>
            <h3 className="text-2xl font-bold text-gray-800">{overdueBooks} Books</h3>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
          <Clock className="text-blue-600" size={20} /> Recent Activity
        </h3>
        
        <div className="space-y-4">
          {recentActivity.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p>You haven't borrowed any books yet.</p>
            </div>
          ) : (
            recentActivity.map((record) => (
              <div key={record._id} className="flex items-center justify-between p-4 rounded-lg border border-gray-50 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
                    <BookOpen className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 line-clamp-1">{record.bookTitle}</h4>
                    <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar size={12} /> Borrowed on {new Date(record.borrowedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {/* Status indicator for the specific book */}
                <div>
                  {record.returned ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Returned</span>
                  ) : new Date() > new Date(record.dueDate) ? (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full animate-pulse">Overdue</span>
                  ) : (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Reading</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default UserDashboard;