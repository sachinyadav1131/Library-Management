import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";


export const notifyUsers = () => {
    cron.schedule("*/30 * * * *", async() => {
        try {
            const oneDayAgo = newDate(Date.now() - 24 * 60 * 60 * 1000);
            const borrowers = await Borrow.find({
                dueDate: 
                   { $lt: oneDayAgo },
                returnDate: null,
                notified: false,
            });

            for(const element of borrowers) {
               if(element.user && element.user.email) {
                  const user = await User.findById(element.user._id);
                  sendEmail ({
                    email: element.user.email,
                    subject: "Overdue Book Notification",
                    message: `Dear ${user.name},\n\nThis is the reminder that the book you borrowed is overdue. Please return the book as soon as possible to avoid any fines.\n\nThank You, \nLibrary Management System`,
                  });
                  element.notified = true,
                  element.save();
               } 
            }
        } catch (error) {
            console.error("Error in notifyUsers: ", error);
        }
    });
}