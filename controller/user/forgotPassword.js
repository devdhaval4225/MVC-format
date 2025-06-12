const User = require("../../model/user.model");
const bcrypt = require("bcrypt");
const sendEmail = require("../../utils/mail.helper");
const mailTemplate = require("../../utils/mailTemplate");
const errorMessage = require("../../common/errorMessage");


exports.forgetPassword = async (req, res) => {
    try {
        const email = req.body.email
        const checkEmail = await User.findOne({ email: email });
        if (checkEmail == null) {
            res.status(404).json({
                message: errorMessage.CHECK_EMAIL,
            })
        } else {
            const newPass = Math.floor(Math.random() * 1000000).toString();
            const decrePass = await bcrypt.hash(newPass, 10);
            const token = await checkEmail.userGenerateAuthtoken();
            const userUpdate = await User.findByIdAndUpdate(
                {
                    _id: checkEmail.id
                },
                {
                    $set: {
                        password: decrePass,
                        token: token

                    }
                },
                {
                    new: true
                }
            );
            const message = `Your Forget Password is :-   ${newPass}`;
            const mailObj = {
                from: process.env.FROM_MAIL,
                to: checkEmail.email,
                subject: "CarServ Forget Password",
                html: message,
              }
            await sendEmail(mailObj);

            res.status(200).json({
                message: "SEND MAIL ON YOUR REGISTER MAIL ADDRESS FOR FORGET PASSWORD",
                status: 200
            })
        }
    } catch (error) {
        console.log("::user-forgetPassword-ERROR::", error);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
}
