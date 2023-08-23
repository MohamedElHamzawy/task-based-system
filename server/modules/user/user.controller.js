const userModel = require("../../DB/user.model");
const HttpError = require("../../common/httpError");

const showAllUsers = async (req,res,next) => {
    const allUsers = await userModel.find({});
    res.json({users: allUsers});
}

const getUser = async (req,res,next) => {
    const userID = req.params.id;
    const thisUser = await userModel.findById({_id: userID});
    res.json({user: thisUser});
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