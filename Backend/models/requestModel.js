import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    user: {
        id: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        name: { type: String, required: true },
        email: { type: String, required: true },
    },
    book: {
        id: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Book", 
            required: true 
        },
        title: { type: String, required: true },
        price: { type: Number, required: true },
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Request = mongoose.model("Request", requestSchema);