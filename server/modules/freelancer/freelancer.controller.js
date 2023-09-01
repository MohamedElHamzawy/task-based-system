const freelancerModel = require("../../DB/freelancer.model");
const accountModel = require("../../DB/account.model");
const taskModel = require("../../DB/task.model");
const HttpError = require("../../common/httpError");

const getAllFreelancers = async (req,res,next) => {
    const freelancers = await freelancerModel.find({}).populate("speciality");
    res.json({freelancers: freelancers});
}

const getFreelancer = async (req, res, next) => {
    const freelancerID = req.params.id;
    const thisFreelancer = await freelancerModel.findById({_id: freelancerID}).populate("speciality");
    if (thisFreelancer) {
        const freelancerTasks = await taskModel.find({freelancer: freelancerID}).populate(["client", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency"]);
        const tasksCount = freelancerTasks.length;
        let totalCost = 0;
        freelancerTasks.forEach(task => {
            totalCost += task.cost;
        });
        const freelancerAccount = await accountModel.find({owner: freelancerID}).populate("owner");
        res.json({freelancer: thisFreelancer, tasksCount: tasksCount, totalCost: totalCost, freelancerTasks: freelancerTasks, freelancerAccount: freelancerAccount});
    } else {
        return next(new HttpError("This freelancer doesn't exist on system", 400));
    }
}

const createFreelancer = async (req,res,next) => {
    const {name, phone, email, country, city, speciality} = req.body;
    const newFreelancer = await new freelancerModel({freelancername: name, phone: phone, email: email, country: country, city: city, speciality: speciality}).save();
    await new accountModel({owner: newFreelancer._id, title: newFreelancer.freelancername, type:"freelancer"}).save();
    res.json({message: "Freelancer has been created successfully"});
}

const updateFreelancer = async (req,res,next) => {
    const {name, phone, email, country, city, speciality} = req.body;
    const freelancerID = req.params.id;
    const tryGetThisFreelancer = await freelancerModel.findById({_id: freelancerID}).populate("speciality");
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
        await accountModel.findOneAndDelete({owner: freelancerID});
        res.json({message: "Freelancer has been deleted successfully"});
    } else {
        return next(new HttpError("This freelancer doesn't exist on system", 400));
    }
}
module.exports = {getAllFreelancers, getFreelancer, createFreelancer, updateFreelancer, deleteFreelancer}