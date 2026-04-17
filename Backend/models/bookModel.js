import mongoose  from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim : true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required:true,
    },
    price: {
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
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    bookPdf: {
        public_id: { type: String },
        url: { type: String }
    },

}
, {
    timestamps: true,
});

export const Book = mongoose.model("Book", bookSchema);