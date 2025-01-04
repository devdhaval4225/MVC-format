const dotenv = require("dotenv");
require("./database/connection");
const express = require("express");
const cors = require("cors")
const app = express();
const cookiesParser = require("cookie-parser");
const passport = require("passport");
const config = require("./config/index")

dotenv.config({
	path: `.env.${config.ENV}`,
});

const port = process.env.PORT || 8000;

app.use(express.urlencoded({extended: false}));
app.use(cookiesParser());
app.use(express.json());
app.use(cors());
// app.use(passport.initialize());
// app.use(passport.session());


const userRouter = require("./routes/users.routes");
app.use('/api/v1/user', userRouter);


app.listen(port, () => {
    console.log(`Server Running At PORT : ${port}`);
});