const userModel = require("../../DB/user.model");
const taskModel = require("../../DB/task.model");
const HttpError = require("../../common/httpError");
const bcrypt = require("bcrypt");
const salt = parseInt(process.env.SALT);
const pepper = process.env.PEPPER;

const showAllUsers = async (req,res,next) => {
    try {
        const allUsers = await userModel.find({});
        res.json({users: allUsers});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const getUser = async (req,res,next) => {
    try {
        const userID = req.params.id;
        const thisUser = await userModel.findById({_id: userID});
        if (thisUser.user_role == "userA") {
            const userTasks = await taskModel.find({created_by: userID}).populate(["client", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency"]);
            res.json({user: thisUser, userTasks: userTasks});
        } else if (thisUser.user_role == "userB") {
            const userTasks = await taskModel.find({accepted_by: userID}).populate(["client", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency"]);
            res.json({user: thisUser, userTasks: userTasks});
        } else {
            const userTasks = await taskModel.find({created_by: userID}).populate(["client", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency"]);
            res.json({user: thisUser, userTasks: userTasks});
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const createUser = async (req,res,next) => {
    try {
        const {
            fullName,
            userName,
            password,
            userRole,
            userType,
            country,
            phone,
            speciality
        } = req.body;
    
        const tryGetUser = await userModel.findOne({username: userName});
        if (tryGetUser) {
            return next(new HttpError("User already registered!", 400));
        } else {
            const hashedPassword = bcrypt.hashSync(password + pepper, salt);
            if (userRole == "userB") {
                const newUser = new userModel({
                    fullname: fullName,
                    username: userName,
                    password: hashedPassword,
                    user_role: userRole,
                    user_type: userType,
                    country: country,
                    phone: phone,
                    speciality: speciality
                }).save();
            } else {
                const newUser = new userModel({
                    fullname: fullName,
                    username: userName,
                    password: hashedPassword,
                    user_role: userRole,
                    user_type: userType,
                    country: country,
                    phone: phone,
                }).save();
            }
            res.json({message: "User has been created successfully"});
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const updateUser = async (req,res,next) => {
    try {
        const {
            fullName,
            userName,
            password,
            userRole,
            userType,
            country,
            phone,
            speciality
        } = req.body;
        const userID = req.params.id;
        const tryGetUser = await userModel.findOne({_id: userID});
        if (tryGetUser) {
            const hashedPassword = bcrypt.hashSync(password + pepper, salt);
            await userModel.updateOne({_id: userID}, {fullname: fullName, username: userName, password: hashedPassword, user_role: userRole, user_type: userType, country: country, phone: phone, speciality: speciality});
            res.json({message:"User has been updated successfully"});
        } else {
            return next(new HttpError("User doesn't exist on system!", 400));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const deleteUser = async (req,res,next) => {
    try {
        const userID = req.params.id;
        const tryGetUser = await userModel.findOne({_id: userID});
        if (tryGetUser) {
            await userModel.deleteOne({_id: userID});
            res.json({message:"User has been deleted successfully"});
        } else {
            return next(new HttpError("User doesn't exist on system!", 400));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = {showAllUsers, getUser, createUser, updateUser, deleteUser}