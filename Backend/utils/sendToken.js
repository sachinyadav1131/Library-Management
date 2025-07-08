export const sendToken = (user, statusCode, message, res) => {
    const token = user.getJWTToken();

    res.status(statusCode).cookie("token", token, {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "lax", // optional but recommended
        secure: false     // true in production (HTTPS)
    }).json({
        success: true,
        user,
        message,
        token,
    });
};
