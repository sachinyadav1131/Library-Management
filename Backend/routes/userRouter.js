import express from 'express';
import { getAllUsers, registerNewAdmin }  from '../controllers/userController.js';
import { isAuthenticated ,  isAuthorised} from '../middlewares/authMiddlewares.js';


const router = express.Router();

router.get("/all", isAuthenticated , isAuthorised("Admin") , getAllUsers);
router.post("/register-admin", isAuthenticated , isAuthorised("Admin") , registerNewAdmin);

export default router;