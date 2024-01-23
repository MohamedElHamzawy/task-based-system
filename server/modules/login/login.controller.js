const userModel = require("../../DB/user.model");
const jwt = require("jsonwebtoken");
const HttpError = require("../../common/httpError");
const bcrypt = require("bcrypt");
const freelancerModel = require("../../DB/freelancer.model");
const pepper = process.env.PEPPER;

const userLogin = async (req,res,next) => {
    try {
        const {userName, password} = req.body;
        const tryGetUser = await userModel.findOne({username: userName});
        const tryGetFreelancer = await freelancerModel.findOne({freelancername: userName});
        if (tryGetUser) {
            const checkPassword = bcrypt.compareSync(password + pepper, tryGetUser.password);
            if (checkPassword) {
                const token = jwt.sign({id: tryGetUser._id}, process.env.TOKEN_KEY);
                await userModel.findByIdAndUpdate( tryGetUser._id,{$set:{deviceToken:req.body.deviceToken}},{multi: true})
                res.json({
                    message: "User logged in successfully",
                    token,
                    user: tryGetUser
                });
            } else {
                return next(new HttpError("Password is incorrect", 400));
            }
        } else if(tryGetFreelancer){
            const checkPassword = bcrypt.compareSync(password + pepper, tryGetFreelancer.password);
            if (checkPassword) {
                const token = jwt.sign({id: tryGetFreelancer._id}, process.env.TOKEN_KEY);
                await freelancerModel.findByIdAndUpdate(tryGetFreelancer._id,{$set:{deviceToken:req.body.deviceToken}},{multi: true})

                res.json({
                    message: "Freelancer logged in successfully",
                    token,
                    user: tryGetFreelancer
                });
            } else {
                return next(new HttpError("Password is incorrect", 400));
            }
        }
        
        else {
            return next(new HttpError("User doesn't exist on system!", 400));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = userLogin;