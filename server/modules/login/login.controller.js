const userModel = require("../../DB/user.model");
const jwt = require("jsonwebtoken");
const HttpError = require("../../common/httpError");
const bcrypt = require("bcrypt");
const pepper = process.env.PEPPER;

const userLogin = async (req,res,next) => {
    const {userName, password} = req.body;
    const tryGetUser = await userModel.findOne({username: userName});
    if (tryGetUser) {
        const checkPassword = bcrypt.compareSync(password + pepper, tryGetUser.password);
        if (checkPassword) {
            const token = jwt.sign({id: tryGetUser._id}, process.env.TOKEN_KEY);
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