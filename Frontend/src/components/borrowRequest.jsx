import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRequests, manageRequest, clearErrors, clearMessage } from "../store/slices/requestSlice";
import { toast } from "react-toastify";
import { Check, X, Clock, ShoppingCart, BookOpen } from "lucide-react";

const BorrowRequests = () => {
  const dispatch = useDispatch();
  const { requests, error, message } = useSelector((state) => state.requests);

  useEffect(() => {
    dispatch(getAllRequests());
  }, [dispatch]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearErrors()); }
    if (message) { 
      toast.success(message); 
      dispatch(clearMessage()); 
      dispatch(getAllRequests()); 
    }
  }, [dispatch, error, message]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Clock className="text-blue-600" /> Pending Store & Library Requests
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Book</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Type & Price</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.filter(r => r.status === "Pending").map((req) => (
              <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm">
                  <p className="font-bold">{req.user.name}</p>
                  <p className="text-gray-500 text-xs">{req.user.email}</p>
                </td>
                <td className="px-6 py-4 text-sm font-medium">{req.book.title}</td>
                
                {/* 👈 Dynamic Badge based on Request Type */}
                <td className="px-6 py-4">
                  <div className="flex flex-col items-start gap-1">
                    <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${
                      req.requestType === "Purchase" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-blue-100 text-blue-700"
                    }`}>
                      {req.requestType === "Purchase" ? <ShoppingCart size={12} /> : <BookOpen size={12} />}
                      {req.requestType}
                    </span>
                    <span className="text-xs font-bold text-gray-600">₹{req.book.price}</span>
                  </div>
                </td>
                
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button 
                    onClick={() => dispatch(manageRequest(req._id, "Approved"))}
                    className="p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 shadow-sm transition-all"
                    title="Approve Request"
                  >
                    <Check size={16} strokeWidth={3} />
                  </button>
                  <button 
                    onClick={() => dispatch(manageRequest(req._id, "Rejected"))}
                    className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 shadow-sm transition-all"
                    title="Reject Request"
                  >
                    <X size={16} strokeWidth={3} />
                  </button>
                </td>
              </tr>
            ))}
            {requests.filter(r => r.status === "Pending").length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500 font-medium">
                  No pending requests at the moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowRequests;