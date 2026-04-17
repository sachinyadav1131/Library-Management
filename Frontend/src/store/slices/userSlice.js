import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
    name: "users",
    initialState: {
        loading: false,
        users: [],
        error: null,
        message: null,
    },
    reducers: {
        getAllUsersRequest(state) {
            state.loading = true;
            state.error = null;
        },
        getAllUsersSuccess(state, action) {
            state.loading = false;
            state.users = action.payload.users;
        },
        getAllUsersFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        
        registerAdminRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        registerAdminSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
        },
        registerAdminFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        
        clearUserErrors(state) {
            state.error = null;
        },
        clearUserMessage(state) {
            state.message = null;
        }
    }
});

// THUNKS
export const getAllUsers = () => async (dispatch) => {
    dispatch(userSlice.actions.getAllUsersRequest());
    try {
        const { data } = await axios.get("http://localhost:4000/api/v1/user/all", {
            withCredentials: true
        });
        dispatch(userSlice.actions.getAllUsersSuccess(data));
    } catch (error) {
        dispatch(userSlice.actions.getAllUsersFailed(error.response?.data?.message || "Failed to fetch users"));
    }
};

export const registerAdmin = (formData) => async (dispatch) => {
    dispatch(userSlice.actions.registerAdminRequest());
    try {
        const { data } = await axios.post("http://localhost:4000/api/v1/user/register-admin", formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data", // Required for file uploads
            }
        });
        dispatch(userSlice.actions.registerAdminSuccess(data));
    } catch (error) {
        dispatch(userSlice.actions.registerAdminFailed(error.response?.data?.message || "Failed to register admin"));
    }
};

export const { clearUserErrors, clearUserMessage } = userSlice.actions;
export default userSlice.reducer;