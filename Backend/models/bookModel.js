import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true, 
    },
    rentPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    purchasePrice: {
        type: Number,
        required: true,
        default: 0,
    },
    quantity: {
        type: Number,
        required: true,
    },
    availability: {
        type: Boolean,
        default: true,
    },
    frontCover: {
        public_id: { type: String },
        url: { type: String }
    },
    bookPdf: {
        public_id: { type: String },
        url: { type: String }
    },
    // 👇 The crucial field for Atlas Vector Search
    embedding: { 
        type: [Number], 
    }
}, {
    timestamps: true,
});

export const Book = mongoose.model("Book", bookSchema);