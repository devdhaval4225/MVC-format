require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const {
    encrypt,
    decrypt
} = require("../common/commonFunction");

exports.verifyUser = async (req, res, next) => {
    try {

        const Token = req.cookies.jwt        
        if (Token) {

            const decoded = jwt.verify(Token, process.env.USER_AUTH_TOKEN);
            const decryptUid = await decrypt(decoded.data);
            const data = await User.findOne({ uid: decryptUid });
            
            

            if (data) {
                const decryptToken = data.tokens.filter((v) => v.token == Token)[0]["token"];                
                req.user = data;
                if (Token == decryptToken) {
                    next();
                } else {
                    res.status(401).json({
                        message: "UNAUTHORIZED",
                        status: 401
                    })
                }

            } else {

                res.status(404).json({
                    message: "DATA NOT FOUND!",
                    status: 404
                })

            }
        } else {

            res.status(403).json({
                message: "FORBIDEN",
                status: 403
            })

        }
    } catch (error) {

        console.log("ERROR::", error);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })

    }
}

