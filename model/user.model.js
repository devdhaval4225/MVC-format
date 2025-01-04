const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [
        {
          token: {
            type: String,
            required: true
          }
        }
      ]
    
}, {
    timestamps: true
}, {
    collection: 'user'
});

userSchema.methods.userGenerateAuthtoken = async function (res) {
    try {
        const generateToken = jwt.sign({ _id: this._id.toString() }, process.env.USER_AUTH_TOKEN);
        this.tokens.token = generateToken
        return generateToken;
    }
    catch (error) {
        console.log('::ERROR_MODEL::', error);
        res.status(403).json({
            message: "TOKEN NOT GENERATE",
            status: 403
        })
    }
}

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 25);
    }
    next();
});

module.exports = mongoose.model("user", userSchema);