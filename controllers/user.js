const CatchAsyncError = require("../middlewares/catch-error");
const User = require("../models/users");
const sendMail = require("../utils/send-mail");
const sendToken = require("../utils/send-token");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

/**
 *  auth
 */

exports.googleAuth = CatchAsyncError(async (req, res, next) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();
    let user = await User.findOne({ email });

    if (user?._id) {
        await User.updateOne(
            { email },
            {
                email,
                name,
                picture,
                lastActivity: new Date()
            }
        );

        await sendToken(user, 200, res);
    } else {
        user = await User.create({
            email,
            name,
            picture,
            lastActivity: new Date()
        });
        await sendMail({
            email,
            subject: `Welcome ${name}`,
            message: `Welcome to users ${name}`

        })
        await sendToken(user, 200, res);

    }
});

// ==============is user already loggedin====================
exports.getuser = CatchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    await user.updateOne({
        lastActivity: new Date()
    })
    res.status(200).json(user);
});