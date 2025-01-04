const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../../model/user.model");
const {
    omit
} = require("lodash");
const errorMessage = require("../../common/errorMessage");
const {
    encrypt,
    decrypt
} = require("../../common/commonFunction");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    try {
        const {error} = loginValidationSchema.validate(req.body);
        if (error) {            
            return res.status(400).json({error: error.message});
        }
        
        const { email, password } = req.body;
        const checkEmail = await User.findOne({ email: email });
                
        if (checkEmail == null) {
            res.status(401).json({
                message: "user is not valid",
                status: 401
            })
        } else {
            const checkPass = await bcrypt.compare(password, checkEmail.password);
            if (checkPass == true) {
                const token = await userToken(checkEmail.uid, checkEmail.tokens);
                // const token = await checkEmail.userGenerateAuthtoken();
                
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 30000000 * 3),
                    httpOnly: true
                })
                    
                res.status(200).json({
                    message: "login successfully",
                    status: 200,
                })
            } else {
                res.status(401).json({
                    message: "password not match",
                    status: 401
                })
            }
        }
    } catch (error) {
        console.log("::user-login-ERROR::", error);
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};

const loginValidationSchema = Joi.object().keys({
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

const userToken = async (uid, tokensArray) => {
    try {
        const tokenGenerater = await encrypt(uid);
        
        const generateToken = await jwt.sign({ data: tokenGenerater }, process.env.USER_AUTH_TOKEN);
        
        tokensArray.push({token:generateToken})

        const tokenGeneret = await User.updateOne(
            {uid: uid},
            {$set: { tokens: tokensArray }},
            {new: true}
        );
        return generateToken;

    } catch (error) {
        console.log("::::error::::",error);
        
    }
};