const router = require('express').Router();
const { verifyUser } = require("../middleware/user.auth");


const { register } = require("../controller/user/register");
const { login } = require("../controller/user/login");
const { currentUser } = require("../controller/user/currentUser");
const { userDelete } = require("../controller/user/userDelete");
const { forgetPassword } = require("../controller/user/forgotPassword");
const { changePassword } = require("../controller/user/changePassword");
const { logout } = require("../controller/user/logout");


router.post('/register', register);
router.post('/login', login);
router.get('/currentUser', verifyUser, currentUser);
router.post('/delete', verifyUser, userDelete);
router.post('/forget-password', forgetPassword);
router.post('/changePassword', verifyUser,changePassword);
router.post('/logout', verifyUser,logout);


module.exports = router;
