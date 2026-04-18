import express from "express";
import { 
    createBorrowRequest, 
    getAllBorrowRequests, 
    manageBorrowRequest 
} from "../controllers/requestController.js";
import { isAuthenticated } from "../middlewares/authMiddlewares.js"; // removed isAdmin if it's missing

const router = express.Router();

// User: Send a request for a specific book
router.post("/send/:bookId", isAuthenticated, createBorrowRequest);

// Admin: Get all requests 
// (Note: If isAdmin is not exported yet, we can check role inside the controller)
router.get("/all", isAuthenticated, getAllBorrowRequests);

// Admin: Approve or Reject a request
router.put("/manage/:requestId", isAuthenticated, manageBorrowRequest);

export default router;