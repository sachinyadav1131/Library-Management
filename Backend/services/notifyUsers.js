import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { sendEmail } from "../utils/sendEmail.js";

export const notifyUsers = () => {
    // Scheduled every 30 minutes
    cron.schedule("*/30 * * * *", async () => {
        console.log("--- Starting Overdue Notification Job ---");
        try {
            // Find books overdue by more than 24 hours that haven't been notified
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            
            const borrowers = await Borrow.find({
                dueDate: { $lt: oneDayAgo },
                returnDate: null,
                notified: false,
            });

            if (borrowers.length === 0) {
                console.log("No new overdue books found.");
                return;
            }

            // Process all notifications in parallel
            await Promise.all(borrowers.map(async (element) => {
                try {
                    if (element.user && element.user.email) {
                        await sendEmail({
                            email: element.user.email,
                            subject: "Action Required: Overdue Book",
                            message: `Hi ${element.user.name || "Member"},\n\nThis is a courtesy reminder that your borrowed book is past its due date. Please return it to the library to avoid further fines.\n\nThank you!`,
                        });

                        element.notified = true;
                        await element.save();
                    }
                } catch (innerError) {
                    console.error(`Failed to notify ${element.user?.email}:`, innerError.message);
                }
            }));

            console.log(`Job Complete: ${borrowers.length} users processed.`);
        } catch (error) {
            console.error("Critical Error in Cron Job:", error);
        }
    });
};