import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Request } from "../models/requestModel.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { Borrow } from "../models/borrowModel.js";
import ErrorHandeler from "../middlewares/errorMiddlewares.js";

// @desc    User: Send a borrow request
export const createBorrowRequest = catchAsyncErrors(async (req, res, next) => {
    const { bookId } = req.params;
    const user = req.user; // Assumes your auth middleware provides req.user

    const book = await Book.findById(bookId);
    if (!book) return next(new ErrorHandeler("Book not found.", 404));

    if (book.quantity < 1) {
        return next(new ErrorHandeler("Book is currently out of stock.", 400));
    }

    // Prevent duplicate pending requests for the same book
    const existingRequest = await Request.findOne({
        "user.id": user._id,
        "book.id": bookId,
        status: "Pending"
    });

    if (existingRequest) {
        return next(new ErrorHandeler("You already have a pending request for this book.", 400));
    }

    await Request.create({
        user: { id: user._id, name: user.name, email: user.email },
        book: { id: book._id, title: book.title, price: book.price },
    });

    res.status(201).json({
        success: true,
        message: "Borrow request submitted successfully! Waiting for Admin approval."
    });
});

// @desc    Admin: Get all pending/all requests
export const getAllBorrowRequests = catchAsyncErrors(async (req, res, next) => {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        requests,
    });
});

// @desc    Admin: Approve or Reject Request
export const manageBorrowRequest = catchAsyncErrors(async (req, res, next) => {
    const { requestId } = req.params;
    const { action } = req.body; // Expects "Approved" or "Rejected"

    const borrowRequest = await Request.findById(requestId);
    if (!borrowRequest) return next(new ErrorHandeler("Request not found.", 404));

    if (borrowRequest.status !== "Pending") {
        return next(new ErrorHandeler("This request has already been processed.", 400));
    }

    if (action === "Approved") {
        const book = await Book.findById(borrowRequest.book.id);
        const user = await User.findById(borrowRequest.user.id);

        if (!book || book.quantity < 1) {
            return next(new ErrorHandeler("Book no longer available.", 400));
        }

        // 1. Update Inventory
        book.quantity -= 1;
        book.availability = book.quantity > 0;
        await book.save();

        // 2. Add Price to User Dues (Backend-Driven Math)
        user.totalFinesDue = (user.totalFinesDue || 0) + Number(book.price);

        const borrowedDate = new Date();
        const dueDate = new Date(borrowedDate.getTime() + 7 * 24 * 60 * 60 * 1000);

        // 3. Add to User's Borrowed Array
        user.borrowedBooks.push({
            bookId: book._id,
            bookTitle: book.title,
            borrowedDate,
            dueDate,
            returned: false,
        });
        await user.save();

        // 4. Create record in Borrow Model
        await Borrow.create({
            user: { id: user._id, name: user.name, email: user.email },
            book: book._id,
            dueDate,
            price: book.price,
        });

        borrowRequest.status = "Approved";
    } else if (action === "Rejected") {
        borrowRequest.status = "Rejected";
    } else {
        return next(new ErrorHandeler("Invalid action.", 400));
    }

    await borrowRequest.save();

    res.status(200).json({
        success: true,
        message: `Request has been ${action} successfully.`
    });
});