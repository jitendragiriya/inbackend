const jsonwebtoken = require("jsonwebtoken");

const SendToken = async (user, statusCode = 200, res) => {
    const token = jsonwebtoken.sign(
        { id: user._id },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
        }
    );

    res.status(statusCode).json({ token });
};

module.exports = SendToken;