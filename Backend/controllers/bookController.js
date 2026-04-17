import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Book } from "../models/bookModel.js";
import ErrorHandeler from "../middlewares/errorMiddlewares.js";
import cloudinary from "cloudinary";

// ==============================
// 1. ADD BOOK
// ==============================
export const addBook = catchAsyncErrors(async (req, res, next) => {
  const { title, author, description, price, quantity } = req.body;

  if (!title || !author || !description || !price || !quantity) {
    return next(new ErrorHandeler("Please fill all fields.", 400));
  }

  let bookData = {
    title,
    author,
    description,
    price,
    quantity,
  };

  // Handle Front Cover Image Upload
  if (req.files && req.files.frontCover) {
    const cover = req.files.frontCover;
    const cloudinaryResponse = await cloudinary.v2.uploader.upload(
      cover.tempFilePath,
      { folder: "LIBRARY_BOOK_COVERS" }
    );
    bookData.frontCover = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  // Handle Complete Book PDF Upload
  if (req.files && req.files.bookPdf) {
    const pdf = req.files.bookPdf;
    const cloudinaryResponse = await cloudinary.v2.uploader.upload(
      pdf.tempFilePath,
      {
        folder: "LIBRARY_BOOK_PDFS",
        resource_type: "raw", 
      }
    );
    bookData.bookPdf = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  const book = await Book.create(bookData);

  res.status(201).json({
    success: true,
    message: "Book added successfully.",
    book,
  });
});

// ==============================
// 2. GET ALL BOOKS
// ==============================
export const getAllBook = catchAsyncErrors(async (req, res, next) => {
  const books = await Book.find();
  res.status(200).json({
    success: true,
    books,
  });
});

// ==============================
// 3. DELETE BOOK
// ==============================
export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const book = await Book.findById(id);

  if (!book) {
    return next(new ErrorHandeler("Book not found.", 404));
  }
  
  await book.deleteOne();
  
  res.status(200).json({
    success: true,
    message: "Book deleted successfully.",
  });
});

// ==============================
// 4. UPDATE BOOK
// ==============================
export const updateBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  let book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandeler("Book not found.", 404));
  }

  // Start with the new text fields sent from the frontend
  let updateData = { ...req.body };

  // If the Admin uploaded a new cover, upload it and update the object
  if (req.files && req.files.frontCover) {
    const cover = req.files.frontCover;
    const cloudinaryResponse = await cloudinary.v2.uploader.upload(
      cover.tempFilePath,
      { folder: "LIBRARY_BOOK_COVERS" }
    );
    updateData.frontCover = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  // If the Admin uploaded a new PDF, upload it and update the object
  if (req.files && req.files.bookPdf) {
    const pdf = req.files.bookPdf;
    const cloudinaryResponse = await cloudinary.v2.uploader.upload(
      pdf.tempFilePath,
      {
        folder: "LIBRARY_BOOK_PDFS",
        resource_type: "raw", 
      }
    );
    updateData.bookPdf = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  // Finally, update the database with the text AND the new file URLs
  book = await Book.findByIdAndUpdate(id, updateData, {
    new: true, 
    runValidators: true, 
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Book updated successfully.",
    book,
  });
});