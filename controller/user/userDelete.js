const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../../model/user.model");
const errorMessage = require("../../common/errorMessage");

exports.userDelete = async (req, res) => {
    try {
        const {error} = deleteUserValidationSchema.validate(req.body);
        if (error) {            
            return res.status(400).json({error: error.message});
        }
        const id = req.user.uid
        const password = req.body.password
        
        const findUser = await User.findOne({ uid: id })
        const checkPass = await bcrypt.compare(password, findUser.password);
        if (checkPass == true) {
            const deleteData = await User.findOneAndDelete({ uId: id })
            return res.status(200).json({
                message: "user delete sucessfully",
            })
        } else {
            return res.status(404).json({
                message: errorMessage.CHECK_PASSWORD,
            })
        }

    } catch (error) {
        console.log("::user-delete-ERROR::", error);
        res.status(500).json({
            message: errorMessage.DATABASE,
        })
    }
}

const deleteUserValidationSchema = Joi.object().keys({
	password: Joi.string()
		.min(8)
		.max(48)
		.error(new Error(errorMessage.PASSWORD))
		.required(),
})