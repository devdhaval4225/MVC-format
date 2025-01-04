const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../../model/user.model");
const errorMessage = require("../../common/errorMessage");


exports.logout = async (req, res) => {
    try {
        const findUser = await User.findOne({uid: req.user.uid})
        

        const currentToken = req.cookies.jwt
        const removeToken = findUser.tokens.filter((obj) => obj.token !== currentToken)
        const userUpdate = await User.findByIdAndUpdate(
            {
                _id: findUser._id
            },
            {
                $set: {
                        tokens: removeToken
    
                }
            },
            {
                new: true
            }
        );

        res.status(200).json({
            message: "logout successfully",
            status: 200,
        })

    } catch (error) {
        console.log("::user-changes-password-ERROR::", error);
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
}