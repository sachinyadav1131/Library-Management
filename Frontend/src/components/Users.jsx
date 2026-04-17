import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users as UsersIcon, UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import { getAllUsers, clearUserErrors, clearUserMessage } from "../store/slices/userSlice";
import AddNewAdmin from "../popups/AddNewAdmin";

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading, error, message } = useSelector((state) => state.users);
  const [isAdminPopupOpen, setIsAdminPopupOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearUserErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(clearUserMessage());
      dispatch(getAllUsers()); // Refresh list after adding admin
      setIsAdminPopupOpen(false);
    }
  }, [dispatch, error, message]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <UsersIcon className="text-blue-600" /> User Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">View all registered users and add admins</p>
        </div>
        <button
          onClick={() => setIsAdminPopupOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm"
        >
          <UserPlus size={18} /> Register New Admin
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && users.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-8 text-gray-500">Loading users...</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    {u.avatar?.url ? (
                      <img src={u.avatar.url} alt="avatar" className="w-10 h-10 rounded-full object-cover border" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{u.name}</div>
                      <div className="text-sm text-gray-500">{u.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${u.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-green-600 font-medium">Verified</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AddNewAdmin isOpen={isAdminPopupOpen} onClose={() => setIsAdminPopupOpen(false)} />
    </div>
  );
};

export default Users;