import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    isAddNewAdminPopupOpen: false,
    isSettingPopupOpen: false,
  },
  reducers: {
    // Toggles the Add New Admin Popup
    toggleAddNewAdminPopup(state, action) {
      // If a specific boolean is passed (true/false), force that state
      if (typeof action.payload === "boolean") {
        state.isAddNewAdminPopupOpen = action.payload;
      } else {
        // Otherwise, just flip the current state
        state.isAddNewAdminPopupOpen = !state.isAddNewAdminPopupOpen;
      }
    },
    
    // Toggles the Settings (Update Credentials) Popup
    toggleSettingPopup(state, action) {
      if (typeof action.payload === "boolean") {
        state.isSettingPopupOpen = action.payload;
      } else {
        state.isSettingPopupOpen = !state.isSettingPopupOpen;
      }
    },
  },
});

export const { toggleAddNewAdminPopup, toggleSettingPopup } = popupSlice.actions;
export default popupSlice.reducer;