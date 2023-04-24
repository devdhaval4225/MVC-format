require("dotenv").config();
require("./database/connection");
const express = require("express");
const cors = require("cors")
const app = express();
const cookiesParser = require("cookie-parser");

const port = process.env.PORT || 8000;

app.use(express.urlencoded({extended: false}));
app.use(cookiesParser());
app.use(express.json());
app.use(cors());


const userRouter = require("./routes/users.routes");
app.use('/user', userRouter);


app.listen(port, () => {
    console.log(`Server Running At PORT : ${port}`);
});