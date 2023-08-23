const freelancerModel = require("../../DB/freelancer.model");

const getAllFreelancers = async (req,res,next) => {
    const freelancers = await freelancerModel.find({});
    res.json({freelancers: freelancers});
}

const getFreelancer = async (req, res, next) => {
    const freelancerID = req.params.id;
    const thisFreelancer = await freelancerModel.findById({_id: freelancerID});
    if (thisFreelancer) {
        res.json({freelancer: thisFreelancer});
    } else {
        res.json({error: "This freelancer doesn't exist on this system"});
    }
}

const createFreelancer = async (req,res,next) => {
    const {name, phone, speciality} = req.body;
    new freelancerModel({freelancername: name, phone: phone, speciality: speciality});
    res.json({message: "Freelancer has been created successfully"});
}

const updateFreelancer = async (req,res,next) => {
    const {name, phone, speciality} = req.body;
    const freelancerID = req.params.id;
    const tryGetThisFreelancer = await freelancerModel.findById({_id: freelancerID});
    if (tryGetThisFreelancer) {
        await freelancerModel.findByIdAndUpdate({_id: freelancerID}, {freelancername: name, phone: phone, speciality: speciality});
        res.json({message: "Freelancer has been updated successfully"});
    } else {
        res.json({error: "This freelancer doesn't exist on system"});
    }
}

const deleteFreelancer = async (req,res,next) => {
    const freelancerID = req.params.id;
    const tryGetThisFreelancer = await freelancerModel.findById({_id: freelancerID});
    if (tryGetThisFreelancer) {
        await freelancerModel.findByIdAndDelete({_id: freelancerID});
        res.json({message: "Freelancer has been deleted successfully"});
    } else {
        res.json({error: "This freelancer doesn't exist on system"});
    }
}
module.exports = {getAllFreelancers, getFreelancer, createFreelancer, updateFreelancer, deleteFreelancer}