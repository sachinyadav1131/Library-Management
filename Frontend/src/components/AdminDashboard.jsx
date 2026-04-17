import React from "react";
import { FaBook, FaUsers, FaExchangeAlt, FaExclamationTriangle } from "react-icons/fa";

const AdminDashboard = () => {
  // These will eventually come from your Redux store / API
  const stats = [
    { label: "Total Books", value: "1,240", icon: <FaBook />, color: "bg-blue-500" },
    { label: "Active Borrows", value: "85", icon: <FaExchangeAlt />, color: "bg-green-500" },
    { label: "Total Users", value: "450", icon: <FaUsers />, color: "bg-purple-500" },
    { label: "Overdue Books", value: "12", icon: <FaExclamationTriangle />, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Recent Borrowings</h3>
          <div className="space-y-4">
            {/* Placeholder for real data */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700">The Alchemist</span>
                  <span className="text-xs text-gray-500">Borrowed by Sachin Kumar</span>
                </div>
                <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">2 hours ago</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Overdue Alerts</h3>
          <div className="space-y-4">
            <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
              <FaExclamationTriangle className="mt-1 mr-3 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">3 Books are significantly overdue!</p>
                <p className="text-xs mt-1">Check the "Users" section to send reminders.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;