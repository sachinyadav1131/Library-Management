import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandeler from "./errorMiddlewares.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return next(new ErrorHandeler("User is not Authenticated.", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return next(new ErrorHandeler("User not found.", 404));
        }
        next();
    } catch (err) {
        
        return next(new ErrorHandeler("Token is invalid or expired.", 401));
    }
});

export const isAuthorised = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandeler(`Role: (${req.user.role}) is not allowed to access this resourse`, 400));
        }
        next();
    };
}


