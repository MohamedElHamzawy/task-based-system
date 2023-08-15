const userModel = require("../../DB/user.model");

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
        res.json({error:"User Already Registed"});
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

const getUser = async (req,res,next) => {
    const userID = req.params.id;
    const thisUser = await userModel.findById({_id: userID});
    res.json({user: thisUser});
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
        res.json({error: "User doesn't exist on system!"});
    }
}

const deleteUser = async (req,res,next) => {
    const userID = req.params.id;
    const tryGetUser = await userModel.findOne({_id: userID});
    if (tryGetUser) {
        await userModel.deleteOne({_id: userID});
        res.json({message:"User has been deleted successfully"});
    } else {
        res.json({error: "User doesn't exist on system!"});
    }
}

const showAllUsers = async (req,res,next) => {
    const allUsers = await userModel.find({});
    res.json({users: allUsers});
}