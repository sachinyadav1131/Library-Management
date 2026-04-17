import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const bookSlice = createSlice({
    name: "books",
    initialState: {
        loading: false,
        books: [],
        error: null,
        message: null,
    },
    reducers: {
        // GET ALL BOOKS
        getAllBooksRequest(state) {
            state.loading = true;
            state.error = null;
        },
        getAllBooksSuccess(state, action) {
            state.loading = false;
            state.books = action.payload.books;
        },
        getAllBooksFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        // ADD NEW BOOK
        addBookRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        addBookSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
        },
        addBookFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        // DELETE BOOK
        deleteBookRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        deleteBookSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
        },
        deleteBookFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        // CLEANUP MESSAGES
        clearBookErrors(state) {
            state.error = null;
        },
        clearBookMessage(state) {
            state.message = null;
        }
    }
});

// ================= THUNKS =================

// Base URL assumption: In app.js, your book router is likely mounted at /api/v1/book
export const getAllBooks = () => async (dispatch) => {
    dispatch(bookSlice.actions.getAllBooksRequest());
    try {
        const { data } = await axios.get("http://localhost:4000/api/v1/book/all", {
            withCredentials: true
        });
        dispatch(bookSlice.actions.getAllBooksSuccess(data));
    } catch (error) {
        dispatch(bookSlice.actions.getAllBooksFailed(error.response?.data?.message || "Failed to fetch books"));
    }
};

export const addBook = (bookData) => async (dispatch) => {
    dispatch(bookSlice.actions.addBookRequest());
    try {
        const { data } = await axios.post("http://localhost:4000/api/v1/book/admin/add", bookData, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            }
        });
        dispatch(bookSlice.actions.addBookSuccess(data));
    } catch (error) {
        dispatch(bookSlice.actions.addBookFailed(error.response?.data?.message || "Failed to add book"));
    }
};

export const deleteBook = (id) => async (dispatch) => {
    dispatch(bookSlice.actions.deleteBookRequest());
    try {
        const { data } = await axios.delete(`http://localhost:4000/api/v1/book/delete/${id}`, {
            withCredentials: true
        });
        dispatch(bookSlice.actions.deleteBookSuccess(data));
    } catch (error) {
        dispatch(bookSlice.actions.deleteBookFailed(error.response?.data?.message || "Failed to delete book"));
    }
};

export const { clearBookErrors, clearBookMessage } = bookSlice.actions;
export default bookSlice.reducer;