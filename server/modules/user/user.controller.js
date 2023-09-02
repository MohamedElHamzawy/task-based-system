const userModel = require("../../DB/user.model");
const taskModel = require("../../DB/task.model");
const HttpError = require("../../common/httpError");

const showAllUsers = async (req,res,next) => {
    const allUsers = await userModel.find({});
    res.json({users: allUsers});
}

const getUser = async (req,res,next) => {
    const userID = req.params.id;
    const thisUser = await userModel.findById({_id: userID});
    if (thisUser.user_role == "userA") {
        const userTasks = await taskModel.find({created_by: userID}).populate(["client", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency"]);
        const tasksCount = userTasks.length;
        let totalGain = 0;
        userTasks.forEach(task => {
            totalGain += (task.paid * task.task_currency.priceToEGP);
        });
        res.json({user: thisUser, tasksCount: tasksCount, totalGain: totalGain, userTasks: userTasks});
    } else if (thisUser.user_role == "userB") {
        const userTasks = await taskModel.find({accepted_by: userID}).populate(["client", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency"]);
        const tasksCount = userTasks.length;
        let totalCost = 0;
        userTasks.forEach(task => {
            totalCost += task.cost;
        });
        res.json({user: thisUser, tasksCount: tasksCount, totalCost: totalCost, userTasks: userTasks});
    } else {
        const userTasks = await taskModel.find({created_by: userID}).populate(["client", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency"]);
        const tasksCount = userTasks.length;
        let totalGain = 0;
        userTasks.forEach(task => {
            totalGain += (task.paid * task.task_currency.priceToEGP);
        });
        res.json({user: thisUser, tasksCount: tasksCount, totalGain: totalGain, userTasks: userTasks});
    }
}

const createUser = async (req,res,next) => {
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
        if (userRole == "userB") {
            const newUser = new userModel({
                fullname: fullName,
                username: userName,
                password: password,
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
                password: password,
                user_role: userRole,
                user_type: userType,
                country: country,
                phone: phone,
            }).save();
        }
        res.json({message: "User has been created successfully"});
    }
}

const updateUser = async (req,res,next) => {
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
        await userModel.updateOne({_id: userID}, {fullname: fullName, username: userName, password: password, user_role: userRole, user_type: userType, country: country, phone: phone, speciality: speciality});
        res.json({message:"User has been updated successfully"});
    } else {
        return next(new HttpError("User doesn't exist on system!", 400));
    }
}

const deleteUser = async (req,res,next) => {
    const userID = req.params.id;
    const tryGetUser = await userModel.findOne({_id: userID});
    if (tryGetUser) {
        await userModel.deleteOne({_id: userID});
        res.json({message:"User has been deleted successfully"});
    } else {
        return next(new HttpError("User doesn't exist on system!", 400));
    }
}

module.exports = {showAllUsers, getUser, createUser, updateUser, deleteUser}