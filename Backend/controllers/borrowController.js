import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { Borrow } from "../models/borrowModel.js";
import ErrorHandeler from "../middlewares/errorMiddlewares.js";
import { calculateFine } from "../utils/fineCalculator.js";

export const borrowedBooks = catchAsyncErrors(async(req, res , next) => {
    const { borrowedBooks } = req.user;
    res.status(200).json({
        success: true,
        borrowedBooks,
        message: "Borrowed books fetched successfully."
    })
});
export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
        return next(new ErrorHandeler("Email is required.", 400));
    }

    const book = await Book.findById(id);
    if (!book) {
        return next(new ErrorHandeler("Book not found.", 400));
    }

    const user = await User.findOne({ email , accountVerified: true});
    if (!user) {
        return next(new ErrorHandeler("User not found.", 400));
    }

    if (book.quantity === 0) {
        return next(new ErrorHandeler("Book is not available.", 400));
    }

    const isAlreadyBorrowed = user.borrowedBooks.find(
        (b) => b.bookId.toString() === id && b.returned === false
    );
    if (isAlreadyBorrowed) {
        return next(new ErrorHandeler("You have already borrowed this book.", 400));
    }

    book.quantity -= 1;
    book.availability = book.quantity > 0;
    await book.save();

    const borrowedDate = new Date();
    const dueDate = new Date(borrowedDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    user.borrowedBooks.push({
        bookId: id,
        bookTitle: book.title,
        borrowedDate,
        dueDate,
        returned: false,
    });

    await user.save();

    // Add entry to Borrow model
    await Borrow.create({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        book: book._id,
        dueDate,
        price: book.price,
    });

    res.status(200).json({
        success: true,
        message: "Book borrowed successfully.",
    });
});


export const getBorrowedBooksForAdmin = catchAsyncErrors(async(req , res , next) => {
    const borrowedBooks  = await Borrow.find();
    res.status(200).json({
        success: true,
        borrowedBooks,
        message: "Borrowed books fetched successfully for admin."
    })
});

export const retuurnBorrowedBook = catchAsyncErrors(async(req , res , next) => {
    const { bookId } = req.params;
    const { email } = req.body;
    const book = await Book.findById(bookId);

    console.log("bookId from params:", bookId); // check if it's undefined, null, or malformed


    if (!email) {
        return next(new ErrorHandeler("Email is required.", 400));
    }
    if (!book) {
        return next(new ErrorHandeler("Book not found.", 400));
    }

    const user = await User.findOne({ email , accountVerified: true});
    if (!user) {
        return next(new ErrorHandeler("User not found.", 400));
    }
    const borrowedBook = user.borrowedBooks.find(
        (b) => b.bookId.toString() === bookId && b.returned === false
    );
    if(!borrowedBook){
        return next(new ErrorHandeler("You have not borrowed this book.", 400));
    }
    borrowedBook.returned = true;
    await user.save();

    book.quantity += 1;
    book.availability = book.quantity > 0;
    await book.save();

    const borrow = await Borrow.findOne({
        book: bookId,
        "user.email": email,
        returnDate: null,
    });
    if(!borrow){
        return next(new ErrorHandeler("You have not borrowed this book.", 400));
    }
    borrow.returnDate = new Date();
    const fine = calculateFine(borrow.dueDate);
    borrow.fine = fine;

    await borrow.save();

    res.status(200).json({
        success: true,
        message: fine !== 0 
        ? `The book has been returned successfully. The total charges , including a fine are ${book.price + book.fine}`
        : `The book has been returned successfully. The total charges are ${book.price}`,
    })
});