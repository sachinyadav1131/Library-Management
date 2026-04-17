import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import bookReducer from "./slices/bookSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        books: bookReducer,
        users: userReducer,
    },
})