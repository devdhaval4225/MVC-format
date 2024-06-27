const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

mongoose.connect("mongodb://127.0.0.1:27017/newTest")
.then(() => {
    console.log("Connection SuccessFully");
})
.catch((err) => {
    console.log(err);
    console.log("Not Connected");
})