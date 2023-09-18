const freelancerModel = require("../../DB/freelancer.model");
const accountModel = require("../../DB/account.model");
const taskModel = require("../../DB/task.model");
const HttpError = require("../../common/httpError");
const statusModel = require("../../DB/status.model");

const getAllFreelancers = async (req,res,next) => {
    try {
        const freelancers = await freelancerModel.find({}).populate("speciality");
        res.json({freelancers: freelancers});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const filterSortedFreelancers = async (req,res,next) => {
    const {sort, speciality} = req.body;
    if (sort && speciality) {
        if (sort == "completed") {
            const allFreelancers = await freelancerModel.find({speciality: speciality}).sort({completedCount: -1});
            res.json({freelancers: allFreelancers});
        } else if (sort == "profit") {
            const allFreelancers = await freelancerModel.find({speciality: speciality}).sort({totalProfit: -1});
            res.json({freelancers: allFreelancers});
        }         
    } else if (sort) {
        if (sort == "completed") {
            const allFreelancers = await freelancerModel.find({}).sort({completedCount: -1});
            res.json({freelancers: allFreelancers});
        } else if (sort == "profit") {
            const allFreelancers = await freelancerModel.find({}).sort({totalProfit: -1});
            res.json({freelancers: allFreelancers});
        }     
    } else if (speciality) {
        const allFreelancers = await freelancerModel.find({speciality: speciality});
        res.json({freelancers: allFreelancers});
    } else {
        return next(new HttpError("Invalid filter & sort!", 404));
    }
}

const getFreelancer = async (req, res, next) => {
    try {
        const freelancerID = req.params.id;
        const thisFreelancer = await freelancerModel.findById({_id: freelancerID}).populate(["speciality", "currency", "country"]);
        if (thisFreelancer) {
            const freelancerTasks = await taskModel.find({freelancer: freelancerID}).populate(["client", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency"]);
            const freelancerAccount = await accountModel.find({owner: freelancerID}).populate("owner");
            res.json({freelancer: thisFreelancer, freelancerTasks: freelancerTasks, freelancerAccount: freelancerAccount});
        } else {
            return next(new HttpError("This freelancer doesn't exist on system", 400));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const createFreelancer = async (req,res,next) => {
    try {
        const {name, phone, email, country, speciality, currency} = req.body;
        const newFreelancer = await new freelancerModel({freelancername: name, phone: phone, email: email, country: country, speciality: speciality, currency}).save();
        await new accountModel({owner: newFreelancer._id, title: newFreelancer.freelancername, type:"freelancer"}).save();
        res.json({message: "Freelancer has been created successfully"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const updateFreelancer = async (req,res,next) => {
    try {
        const {name, phone, email, country, currency, speciality} = req.body;
        const freelancerID = req.params.id;
        const tryGetThisFreelancer = await freelancerModel.findById({_id: freelancerID}).populate("speciality");
        if (tryGetThisFreelancer) {
            await freelancerModel.findByIdAndUpdate({_id: freelancerID}, {freelancername: name, phone: phone, email: email, country: country, currency: currency, speciality: speciality});
            res.json({message: "Freelancer has been updated successfully"});
        } else {
            return next(new HttpError("This freelancer doesn't exist on system", 400));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const deleteFreelancer = async (req,res,next) => {
    try {
        const freelancerID = req.params.id;
        const tryGetThisFreelancer = await freelancerModel.findById({_id: freelancerID});
        if (tryGetThisFreelancer) {
            await freelancerModel.findByIdAndDelete({_id: freelancerID});
            await accountModel.findOneAndDelete({owner: freelancerID});
            res.json({message: "Freelancer has been deleted successfully"});
        } else {
            return next(new HttpError("This freelancer doesn't exist on system", 400));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}
module.exports = {getAllFreelancers, getFreelancer, filterSortedFreelancers, createFreelancer, updateFreelancer, deleteFreelancer}