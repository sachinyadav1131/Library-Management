import { config } from 'dotenv';
config({ path: './config/config.env' });


import express from "express";
import { forgotPassword, getUser, login, logout, register, verifyOTP } from "../controllers/authController.js";
import { isAuthenticated } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post("/register", register);
router.post("/verify_otp", verifyOTP);
router.post("/login", login);
router.get("/logout",isAuthenticated, logout);
router.get("/me",isAuthenticated, getUser);
router.post("/password/forgot", forgotPassword);


export default router;