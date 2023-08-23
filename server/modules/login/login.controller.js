const userModel = require("../../DB/user.model");
const jwt = require("jsonwebtoken");
const HttpError = require("../../common/httpError");

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
            return next(new HttpError("Password is incorrect", 400));
        }
    } else {
        return next(new HttpError("User doesn't exist on system!", 400));
    }
}

module.exports = userLogin;