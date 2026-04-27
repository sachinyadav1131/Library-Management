import { isAuthenticated, isAuthorised } from "../middlewares/authMiddlewares.js";
import { 
    addBook, 
    deleteBook, 
    getAllBook, 
    updateBook, 
    searchBooksRAG // 👈 The new Cloud RAG Controller
} from "../controllers/bookController.js";
import express from "express";

const router = express.Router();

router.post("/admin/add", isAuthenticated, isAuthorised("Admin"), addBook);

// 🧠 NEW: ATLAS AI VIBE SEARCH ROUTE (Changed to POST)
router.post("/rag-search", isAuthenticated, searchBooksRAG);

router.get("/all", isAuthenticated, getAllBook);
router.put("/update/:id", isAuthenticated, isAuthorised("Admin"), updateBook);
router.delete("/delete/:id", isAuthenticated, isAuthorised("Admin"), deleteBook);

export default router;