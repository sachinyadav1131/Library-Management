import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Camera, Save, User } from "lucide-react";
import { useDispatch } from "react-redux";
// import { updateProfile } from "../store/slices/authSlice"; // You'll create this thunk

const ProfileModal = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (avatar) formData.append("avatar", avatar);
    
    // dispatch(updateProfile(formData));
    setIsEditMode(false);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-zoomIn">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 hover:bg-white/20 p-1 rounded-full"><X size={20}/></button>
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img src={avatarPreview} className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg" alt="profile"/>
              {isEditMode && (
                <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full text-blue-600 cursor-pointer shadow-md hover:scale-110 transition-transform">
                  <Camera size={16} />
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              )}
            </div>
            <h2 className="mt-3 text-xl font-bold">{user?.name}</h2>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">{user?.role}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
            <p className="text-gray-800 font-medium">{user?.email}</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Display Name</label>
            {isEditMode ? (
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full border-b-2 border-blue-500 py-1 focus:outline-none font-medium text-gray-800"
              />
            ) : (
              <p className="text-gray-800 font-medium">{user?.name}</p>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            {isEditMode ? (
              <>
                <button onClick={handleUpdate} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"><Save size={18}/> Save Changes</button>
                <button onClick={() => setIsEditMode(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 font-bold">Cancel</button>
              </>
            ) : (
              <button onClick={() => setIsEditMode(true)} className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors">Edit Profile Info</button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProfileModal;