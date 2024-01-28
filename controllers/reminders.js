const CatchAsyncError = require("../middlewares/catch-error");
const User = require("../models/users");
const sendMail = require("../utils/send-mail"); 

exports.explored = CatchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const { id, name } = req.body;

    setTimeout(() => {
         sendMail({
            email: user.email,
            message: `Please checkout our course\n\n ${name}\n\n${process.env.PRODUCTION_CORS}/${id}`,
            subject: "Checkout course"
        });
      }, 300000); // 5 minutes in milliseconds 
    res.status(200).json({success:true});
});