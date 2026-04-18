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
    // Adding category (highly recommended for both the UI Catalog and AI context)
    category: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        // Optional: You might want to remove 'required: true' later if you 
        // want the database to allow saving while the AI is still generating the text.
        required: true, 
    },
    
    // 💵 PRICING SPLIT (Replaced single 'price' field)
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

    embedding: { 
        type: [Number], 
    }
}, {
    timestamps: true,
});

export const Book = mongoose.model("Book", bookSchema);