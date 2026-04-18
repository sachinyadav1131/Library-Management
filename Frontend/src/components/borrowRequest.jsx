import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRequests, manageRequest, clearErrors, clearMessage } from "../store/slices/requestSlice";
import { toast } from "react-toastify";
import { Check, X, Clock } from "lucide-react";

const BorrowRequests = () => {
  const dispatch = useDispatch();
  const { requests, loading, error, message } = useSelector((state) => state.requests);

  useEffect(() => {
    dispatch(getAllRequests());
  }, [dispatch]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearErrors()); }
    if (message) { 
      toast.success(message); 
      dispatch(clearMessage()); 
      dispatch(getAllRequests()); // Refresh list
    }
  }, [dispatch, error, message]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Clock className="text-blue-600" /> Pending Borrow Requests
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Book</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.filter(r => r.status === "Pending").map((req) => (
              <tr key={req._id}>
                <td className="px-6 py-4 text-sm">
                  <p className="font-bold">{req.user.name}</p>
                  <p className="text-gray-500 text-xs">{req.user.email}</p>
                </td>
                <td className="px-6 py-4 text-sm font-medium">{req.book.title}</td>
                <td className="px-6 py-4">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">Pending</span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button 
                    onClick={() => dispatch(manageRequest(req._id, "Approved"))}
                    className="p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200"
                  >
                    <Check size={16} />
                  </button>
                  <button 
                    onClick={() => dispatch(manageRequest(req._id, "Rejected"))}
                    className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    <X size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowRequests;