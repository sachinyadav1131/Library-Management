import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users as UsersIcon, Wallet, X } from "lucide-react";
import { toast } from "react-toastify";
import { getAllUsers, settleDues, clearUserErrors, clearUserMessage } from "../store/slices/userSlice";

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading, error, message } = useSelector((state) => state.users);

  const [paymentUser, setPaymentUser] = useState(null);
  const [fineAdded, setFineAdded] = useState("");
  const [amountPaid, setAmountPaid] = useState("");

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
      dispatch(getAllUsers()); 
      setPaymentUser(null); 
    }
  }, [dispatch, error, message]);

  const handleSettleSubmit = (e) => {
    e.preventDefault();
    dispatch(settleDues(paymentUser._id, { 
        fineAdded: Number(fineAdded), 
        amountPaid: Number(amountPaid) 
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <UsersIcon className="text-blue-600" /> Member Directory
        </h2>
        <p className="text-sm text-gray-500 mt-1">Manage user accounts and settle dues.</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">User Info</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Total Due</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-800">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 text-xs font-bold uppercase text-gray-600">
                  {user.role}
                </td>
                <td className="px-6 py-4">
                  <span className={`font-bold ${user.totalFinesDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{user.totalFinesDue || 0}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-end">
                  <button 
                    onClick={() => { setPaymentUser(user); setFineAdded(""); setAmountPaid(""); }}
                    className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    <Wallet size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {paymentUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-5 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">Settle Dues: {paymentUser.name}</h3>
              <button onClick={() => setPaymentUser(null)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSettleSubmit} className="p-5 space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
                <p className="text-xs font-bold text-blue-600 uppercase">Amount Owed</p>
                <p className="text-3xl font-black text-blue-900">₹{paymentUser.totalFinesDue || 0}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Add Charge (₹)</label>
                  <input type="number" value={fineAdded} onChange={(e)=>setFineAdded(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-green-700 mb-1">Paid (₹)</label>
                  <input type="number" value={amountPaid} onChange={(e)=>setAmountPaid(e.target.value)} className="w-full px-3 py-2 border-green-200 bg-green-50 rounded-md" placeholder="0" />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-all">
                Save Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;