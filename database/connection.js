const mongoose = require("mongoose");
const dotenv = require("dotenv");
const config = require("../config/index");
dotenv.config({
	path: `.env.${config.ENV}`,
});

const dbUrl = process.env.DB_URL
mongoose.set('strictQuery', false);
mongoose.connect(dbUrl)
.then(() => {
    console.log("Connection SuccessFully");
})
.catch((err) => {
    console.log(err);
    console.log("Not Connected Database!");
})