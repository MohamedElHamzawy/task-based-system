const jwt = require("jsonwebtoken");
const userModel = require("../DB/user.model");
const HttpError = require("../common/httpError");

const auth = (data) => {
    return async (req,res,next) => {
        let tokenHeader = req.headers["authorization"];
        if (!tokenHeader || !tokenHeader.startsWith("Bearer")) {
            return next(new HttpError("Invalid token!", 401));
        } else {
            let token = tokenHeader.split(" ")[1];
            let {id} = jwt.verify(token, process.env.TOKEN_KEY);
            let user = await userModel.findOne({_id: id}).select("-password");
            if (user) {
                req.user = user;
                next();
            } else {
                return next(new HttpError("User not Found", 404));
            }
        }
    }
}
module.exports = auth;