const User = require("../model/user.model");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/mail.helper");


exports.insert = async (req, res) => {
    try {
        const { email, reEmail, password, rePassword, username } = req.body;
        const checkUsername = await User.findOne({ username: username });
        const checkEmail = await User.findOne({ email: email });
        if (checkUsername == null) {
            if (checkEmail == null) {
                if (email == reEmail) {
                    if (password == rePassword) {
                        if (password.length >= 6) {
                            const insertUser = new User({
                                username: username,
                                email: email,
                                password: password
                            });
                            const saveData = await insertUser.save();
                            res.status(201).json({
                                message: "user insert sucessfully",
                                status: 201,
                                data: saveData
                            })
                        } else {
                            res.status(404).json({
                                message: "password must be 6 digit",
                                status: 404
                            })
                        }
                    } else {
                        res.status(404).json({
                            message: "password not match",
                            status: 404
                        })
                    }
                } else {
                    res.status(404).json({
                        message: "Email not match",
                        status: 404
                    })
                }
            } else {
                res.status(404).json({
                    message: "Email already exitst.",
                    status: 404
                })
            }
        } else {
            res.status(404).json({
                message: "Username already exitst.",
                status: 404
            })
        }

    } catch (error) {
        console.log("::user-insert-ERROR::", error);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const checkUsername = await User.findOne({ username: username });
        if (checkUsername == null) {
            res.status(401).json({
                message: "username is not valid",
                status: 401
            })
        } else {
            const checkPass = await bcrypt.compare(password, checkUsername.password);
            if (checkPass == true) {
                const token = checkUsername.userGenerateAuthtoken();
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 30000000 * 3),
                    httpOnly: true
                })
                const tokenGeneret = await User.findByIdAndUpdate(
                    {
                        _id: checkUsername.id
                    },
                    {
                        $set: {
                            token: token
                        }
                    },
                    {
                        new: true
                    })
                res.status(200).json({
                    message: "login successfully",
                    status: 200,
                    data: tokenGeneret
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
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
}

exports.show = async (req, res) => {
    try {
        const id = req.user._id
        const showData = await User.findById({ _id: id })
        if (showData == null) {
            res.status(404).json({
                message: "user not exitst.",
                status: 404
            })
        } else {
            res.status(200).json({
                message: "user show",
                status: 200,
                data: showData
            })
        }
    } catch (error) {
        console.log("::user-show-ERROR::", error);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
}

exports.userDelete = async (req, res) => {
    try {
        const id = req.params.id
        const deleteData = await User.findByIdAndDelete({ _id: id })
        if (deleteData == null) {
            res.status(404).json({
                message: "user not exitst.",
                status: 404
            })
        } else {
            res.status(200).json({
                message: "user delete sucessfully",
                status: 200
            })
        }

    } catch (error) {
        console.log("::user-delete-ERROR::", error);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
}

exports.forgetPassword = async (req, res) => {
    try {
        const email = req.body.email
        const checkEmail = await User.findOne({ email: email });
        if (checkEmail == null) {
            res.status(401).json({
                message: "email is not valid",
                status: 401
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
            const message = `Your FORGET PASSWORD is :-   ${newPass}`;
            await sendEmail(email, "FORGET PASSWORD", message);

            res.status(200).json({
                message: "SEND MAIL ON YOUR REGISTER MAIL ADDRESS FOR FORGET PASSWORD",
                status: 200
            })

            // res.status(200).json({
            //     message: "new password user",
            //     status: 200,
            //     data: newPass
            // })
        }
    } catch (error) {
        console.log("::user-forgetPassword-ERROR::", error);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
}
