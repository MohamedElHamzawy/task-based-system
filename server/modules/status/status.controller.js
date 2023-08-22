const statusModel = require("../../DB/status.model");

const getAllStatuses = async (req,res,next) => {
    const statuses = await statusModel.find({});
    res.json({statuses: statuses});
}

const getStatus = async (req,res,next) => {
    const statusID = req.params.id;
    const thisStatus = await statusModel.findById({_id: statusID});
    if (thisStatus) {
        res.json({message: thisStatus});
    } else {
        res.json({error: "This status doesn't exist"});
    }
}

const createStatus = async (req,res,next) => {
    const {name,slug} = req.body;
    const tryGetThisStatus = await statusModel.findOne({slug:slug});
    if (tryGetThisStatus) {
        res.json({error: "This status already exists!"});
    } else {
        new statusModel({statusname:name, slug:slug}).save();
        res.json({message:"Status has been created successfully"});
    }
}

const updateStatus = async (req,res,next) => {
    const {name, slug} = req.body;
    const statusID = req.params.id;
    const tryGetThisStatus = await statusModel.findOne({slug:slug});
    if (tryGetThisStatus) {
        await statusModel.findByIdAndUpdate({_id: statusID}, {statusname: name, slug: slug});
        res.json({message:"Status has been updated successfully"});
    } else {
        res.json({error: "This status doesn't exist on system!"});
    }
}

const deleteStatus = async (req,res,next) => {
    const statusID = req.params.id;
    const tryGetThisStatus = await statusModel.findOne({_id:statusID});
    if (tryGetThisStatus) {
        await statusModel.findByIdAndDelete({_id: statusID});
        res.json({message:"Status has been deleted successfully"});
    } else {
        res.json({error: "This status doesn't exist on system!"});
    }
}
module.exports = {getAllStatuses, getStatus, createStatus, updateStatus, deleteStatus}