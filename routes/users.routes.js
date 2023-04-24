const router = require('express').Router();
const { verifyUser } = require("../middleware/user.auth");


const {
  insert,
  login,
  show,
  userDelete,
  forgetPassword
} = require("../controller/user.controller");


router.post('/insert', insert);
router.post('/login', login);
router.get('/show/:id', verifyUser, show);
router.delete('/delete/:id', verifyUser, userDelete);
router.post('/forget-password', forgetPassword)


module.exports = router;
