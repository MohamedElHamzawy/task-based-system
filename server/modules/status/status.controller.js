const statusModel = require("../../DB/status.model");
const HttpError = require("../../common/httpError");

const getAllStatuses = async (req,res,next) => {
    try {
        const role = req.user.user_role;
        let statuses;
        if (role == "admin") {
            statuses = await statusModel.find({});
        } else {
            statuses = await statusModel.find({$or: [{role:role}, {role: "all"}]});
        }
        res.json({statuses: statuses});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const getStatus = async (req,res,next) => {
    try {
        const statusID = req.params.id;
        const thisStatus = await statusModel.findById({_id: statusID});
        if (thisStatus) {
            res.json({message: thisStatus});
        } else {
            return next(new HttpError("This status doesn't exist on system", 400));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const createStatus = async (req,res,next) => {
    try {
        const {name, role} = req.body;
        const slug = name.replace(" ", "-");
        const tryGetThisStatus = await statusModel.findOne({slug:slug});
        if (tryGetThisStatus) {
            return next(new HttpError("This status already exists!", 400));
        } else {
            await new statusModel({statusname:name, slug:slug, role:role}).save();
            res.json({message:"Status has been created successfully"});
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const updateStatus = async (req,res,next) => {
    try {
        const {name, role} = req.body;
        const slug = name.replace(" ", "-");
        const statusID = req.params.id;
        const tryGetThisStatus = await statusModel.findOne({_id:statusID});
        if (tryGetThisStatus) {
            await statusModel.findByIdAndUpdate({_id: statusID}, {statusname: name, slug: slug, role: role});
            res.json({message:"Status has been updated successfully"});
        } else {
            return next(new HttpError("This status doesn't exist on system", 400));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const deleteStatus = async (req,res,next) => {
    try {
        const statusID = req.params.id;
        const tryGetThisStatus = await statusModel.findOne({_id:statusID});
        if (tryGetThisStatus) {
            await statusModel.findByIdAndDelete({_id: statusID});
            res.json({message:"Status has been deleted successfully"});
        } else {
            return next(new HttpError("This status doesn't exist on system", 400));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}
module.exports = {getAllStatuses, getStatus, createStatus, updateStatus, deleteStatus}