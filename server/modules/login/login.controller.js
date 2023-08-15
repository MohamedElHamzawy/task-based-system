const userModel = require("../../DB/user.model");
const jwt = require("jsonwebtoken");

const userLogin = async (req,res,next) => {
    const {userName, password} = req.body;
    const tryGetUser = await userModel.findOne({username: userName});
    if (tryGetUser) {
        if (tryGetUser.password === password) {
            const token = jwt.sign({id: tryGetUser._id}, "tb2023");
            res.json({
                message: "User logged in successfully",
                token,
                user: tryGetUser
            });
        } else {
            res.json({error: "Password is incorrect"});
        }
    } else {
        res.json({error: "User doesn't exist on system"});
    }
}

module.exports = userLogin;