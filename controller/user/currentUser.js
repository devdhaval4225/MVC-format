const User = require("../../model/user.model");

const {
    pick
} = require("lodash");


exports.currentUser = async (req, res) => {
    try {
        const id = req.user.uid
        const showData = await User.findOne({ uid: id })
        
        if (showData == null) {
            res.status(404).json({
                message: "user not exitst.",
                status: 404
            })
        } else {
            const newRes = pick(showData,["uid","email"])
            res.status(200).json({
                data: newRes
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