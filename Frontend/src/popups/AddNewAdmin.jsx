import React, { useState } from "react";
import { createPortal } from "react-dom"; // 👈 Import createPortal
import { useDispatch, useSelector } from "react-redux";
import { X, UploadCloud } from "lucide-react";
import { registerAdmin } from "../store/slices/userSlice";
import { toast } from "react-toastify";

const AddNewAdmin = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.users);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setAvatarPreview(reader.result);
        setAvatar(file);
      };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!avatar) {
      toast.error("Please upload an avatar image.");
      return;
    }
    
    // We MUST use FormData because we are sending a file (image)
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);

    dispatch(registerAdmin(formData));
  };

  if (!isOpen) return null;

  // 👈 Using createPortal teleports the popup to the document body!
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Register New Admin</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 relative group">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <UploadCloud className="text-gray-400" size={32} />
              )}
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleAvatarChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Click to upload avatar</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-lg mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-lg mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="8 - 16 characters" className="w-full px-4 py-2 border rounded-lg mt-1" />
          </div>

          <div className="pt-4 flex gap-3 justify-end mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-70">
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body // 👈 This is the second argument for createPortal
  );
};

export default AddNewAdmin;