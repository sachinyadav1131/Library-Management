import { isAuthenticated, isAuthorised } from "../middlewares/authMiddlewares.js";

import { addBook,deleteBook,getAllBook ,updateBook} from "../controllers/bookController.js";
import express from "express";

const router = express.Router();
router.post("/admin/add", isAuthenticated, isAuthorised("Admin") , addBook);
router.get("/all", isAuthenticated, getAllBook);
router.put("/update/:id", isAuthenticated, isAuthorised("Admin"), updateBook);
router.delete("/delete/:id" , isAuthenticated , isAuthorised("Admin") , deleteBook);

export default router;