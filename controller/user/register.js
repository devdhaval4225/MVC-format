const User = require("../../model/user.model");
const Joi = require("joi");
const {
    uniqueNumber
} = require("../../common/commonFunction");
const errorMessage = require("../../common/errorMessage");

exports.register = async (req, res) => {
    try {
        const {error} = registrationValidationSchema.validate(req.body);
        if (error) {            
            return res.status(400).json({error: error.message});
        }
        const { email, password } = req.body;
        const checkEmail = await User.findOne({ email: email });
        if (checkEmail == null) {
            const uID = await uniqueNumber('user');
            const insertUser = new User({
                uid: uID,
                email: email,
                password: password
            });
            const saveData = await insertUser.save();
            res.status(201).json({
                message: "Registration is successfully",
            })
        } else {
            res.status(404).json({
                message: "Email already exitst.",
            })
        }

    } catch (error) {
        console.log("::user-insert-ERROR::", error);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
};

const registrationValidationSchema = Joi.object().keys({
    email: Joi.string()
        .min(3)
        .max(100)
        .email()
        .error(new Error(errorMessage.EMAIL))
        .required(),
    password: Joi.string()
        .min(8)
        .max(48)
        .error(new Error(errorMessage.PASSWORD))
        .required(),
})