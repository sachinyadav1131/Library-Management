import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import bookReducer from "./slices/bookSlice";
import userReducer from "./slices/userSlice";
import borrowReducer from "./slices/borrowSlice";
import popupReducer from "./slices/popUpSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        books: bookReducer,
        users: userReducer,
        borrow: borrowReducer,
        popup: popupReducer,
    },
})