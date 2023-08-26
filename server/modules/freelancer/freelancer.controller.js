const freelancerModel = require("../../DB/freelancer.model");
const accountModel = require("../../DB/account.model");
const HttpError = require("../../common/httpError");

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
        return next(new HttpError("This freelancer doesn't exist on system", 400));
    }
}

const createFreelancer = async (req,res,next) => {
    const {name, phone, email, country, city, speciality} = req.body;
    const newFreelancer = await new freelancerModel({freelancername: name, phone: phone, email: email, country: country, city: city, speciality: speciality}).save();
    new accountModel({owner: newFreelancer._id, title: newFreelancer.freelancername, type:"freelancer"}).save();
    res.json({message: "Freelancer has been created successfully"});
}

const updateFreelancer = async (req,res,next) => {
    const {name, phone, email, country, city, speciality} = req.body;
    const freelancerID = req.params.id;
    const tryGetThisFreelancer = await freelancerModel.findById({_id: freelancerID});
    if (tryGetThisFreelancer) {
        await freelancerModel.findByIdAndUpdate({_id: freelancerID}, {freelancername: name, phone: phone, email: email, country: country, city: city, speciality: speciality});
        res.json({message: "Freelancer has been updated successfully"});
    } else {
        return next(new HttpError("This freelancer doesn't exist on system", 400));
    }
}

const deleteFreelancer = async (req,res,next) => {
    const freelancerID = req.params.id;
    const tryGetThisFreelancer = await freelancerModel.findById({_id: freelancerID});
    if (tryGetThisFreelancer) {
        await freelancerModel.findByIdAndDelete({_id: freelancerID});
        res.json({message: "Freelancer has been deleted successfully"});
    } else {
        return next(new HttpError("This freelancer doesn't exist on system", 400));
    }
}
module.exports = {getAllFreelancers, getFreelancer, createFreelancer, updateFreelancer, deleteFreelancer}