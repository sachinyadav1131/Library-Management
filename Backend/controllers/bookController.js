import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import { Book } from '../models/bookModel.js';
import { User } from '../models/userModel.js';
import ErrorHandeler from '../middlewares/errorMiddlewares.js';

export const addBook = catchAsyncErrors(async (req , res , next) => {
    const {title , author, description , price , quantity} = req.body;
       if(!title || !author || !description || !price || !quantity){
         return next(new ErrorHandeler("Please fill all fields.", 400));
       }

       const book = await Book.create({
          title,
          author,
          description,
          price,
          quantity,
       });
       res.status(201).json({
         success: true,
         message: "Book added successfully.",
         book,
       });
});

export const deleteBook = catchAsyncErrors(async (req , res , next) => {
    const {id} = req.params;
    const book = await Book.findById(id);

    if(!book){
        return next(new ErrorHandeler("Book not found.",404));
    }
    await book.deleteOne();
    res.status(200).json({
        success: true,
        message: "Book deleted successfully.",
    });
});

export const getAllBook = catchAsyncErrors(async (req , res , next) => {
   const books = await Book.find();
   res.status(200).json({
    success: true,
    books,
   });
});

export const updateBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    
    // 1. Check if the book actually exists
    let book = await Book.findById(id);
    if (!book) {
        return next(new ErrorHandeler("Book not found.", 404));
    }

    // 2. Update the book with the new data from req.body
    book = await Book.findByIdAndUpdate(id, req.body, {
        new: true, // Returns the newly updated document
        runValidators: true, // Ensures the new data matches your schema rules
        useFindAndModify: false,
    });

    // 3. Send success response
    res.status(200).json({
        success: true,
        message: "Book updated successfully.",
        book,
    });
});