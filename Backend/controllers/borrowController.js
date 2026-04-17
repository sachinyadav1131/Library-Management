import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { Borrow } from "../models/borrowModel.js";
import ErrorHandeler from "../middlewares/errorMiddlewares.js";
import { calculateFine } from "../utils/fineCalculator.js";

// @desc    Fetch borrowed books for the logged-in user
export const borrowedBooks = catchAsyncErrors(async(req, res , next) => {
    const { borrowedBooks } = req.user;
    res.status(200).json({
        success: true,
        borrowedBooks,
        message: "Borrowed books fetched successfully."
    })
});

// @desc    Issue a book (Price added to user balance immediately)
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

    // 1. Update Book Inventory
    book.quantity -= 1;
    book.availability = book.quantity > 0;
    await book.save();

    const borrowedDate = new Date();
    const dueDate = new Date(borrowedDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    // 2. 💰 SIMPLE LOGIC: Add book price to user's debt immediately at checkout
    user.totalFinesDue = (user.totalFinesDue || 0) + Number(book.price || 0);

    user.borrowedBooks.push({
        bookId: id,
        bookTitle: book.title,
        borrowedDate,
        dueDate,
        returned: false,
    });

    await user.save();

    // 3. Add entry to Borrow model
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
        message: `Book borrowed successfully. ₹${book.price} has been added to user dues.`,
    });
});

// @desc    Get all borrow records for Admin
export const getBorrowedBooksForAdmin = catchAsyncErrors(async(req , res , next) => {
    const borrowedBooks  = await Borrow.find();
    res.status(200).json({
        success: true,
        borrowedBooks,
        message: "Borrowed books fetched successfully for admin."
    })
});

// @desc    Return a book (Only Late Fines added to user balance)
export const retuurnBorrowedBook = catchAsyncErrors(async(req , res , next) => {
    const { bookId } = req.params;
    const { email } = req.body;
    
    const book = await Book.findById(bookId);
    if (!book) return next(new ErrorHandeler("Book not found.", 404));

    const user = await User.findOne({ email , accountVerified: true});
    if (!user) return next(new ErrorHandeler("User not found.", 404));

    // 1. Find active borrow record in User model
    const borrowedBook = user.borrowedBooks.find(
        (b) => b.bookId.toString() === bookId && b.returned === false
    );
    if(!borrowedBook) return next(new ErrorHandeler("No active borrow record found for this user.", 400));

    // 2. Find the record in Borrow model
    const borrow = await Borrow.findOne({
        book: bookId,
        "user.email": email,
        returnDate: null,
    });
    if(!borrow) return next(new ErrorHandeler("Borrow record not found.", 400));

    // 3. 💰 MONEY CALCULATION: Price was already added at checkout, so ONLY add fines now.
    borrow.returnDate = new Date();
    const fine = calculateFine(borrow.dueDate);
    borrow.fine = fine;
    
    // Update user balance if there is a fine
    if (fine > 0) {
        user.totalFinesDue = (user.totalFinesDue || 0) + fine;
    }

    // 4. Mark as returned and save User
    borrowedBook.returned = true; 
    await user.save(); 

    // 5. Update Book Inventory
    book.quantity += 1;
    book.availability = book.quantity > 0;
    await book.save();

    // 6. Save Borrow Record
    await borrow.save();

    res.status(200).json({
        success: true,
        message: fine !== 0 
        ? `Book returned. Late fine of ₹${fine} added to account.` 
        : `Book returned successfully. No late fines incurred.`,
    });
});