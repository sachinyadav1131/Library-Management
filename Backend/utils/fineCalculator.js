export const calculateFine = (dueDate) => {
    const finePerHour = 0.1;

    const today = new Date();
    const due = new Date(dueDate);

    const timeDifference = today - due;
    const hoursLate = Math.ceil(timeDifference / (1000 * 60 * 60));
    const fine = hoursLate > 0 ? hoursLate * finePerHour : 0;

    return fine;
    message: "Book returned successfully."
}