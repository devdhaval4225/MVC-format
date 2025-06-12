const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../../model/user.model");
const errorMessage = require("../../common/errorMessage");


exports.changePassword = async (req, res) => {
    try {
        const findUser = await User.findOne({uid: req.user.uid})
        const {error} = changePasswordValidationSchema.validate(req.body);
        if (error) {            
            return res.status(400).json({error: error.message});
        }

        const password = req.body.password

        if (findUser == null) {
            res.status(500).json({
                message: errorMessage.UNAUTHORIZED,
            })
        } else {
            const newPassword = await bcrypt.hash(password, 10);
            const userUpdate = await User.findByIdAndUpdate(
                {
                    _id: findUser._id
                },
                {
                    $set: {
                            password: newPassword,
                            tokens: []
                    }
                },
                {
                    new: true
                }
            );
            const findNewUser = await User.findOne({uid: req.user.uid})

            res.status(200).json({
                message: "password changes successfully",
                status: 200,
            })
        }

    } catch (error) {
        console.log("::user-changes-password-ERROR::", error);
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};



const changePasswordValidationSchema = Joi.object().keys({
	password: Joi.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/)
		.error(new Error(errorMessage.PASSWORD_ISSUE))
		.required(),
})