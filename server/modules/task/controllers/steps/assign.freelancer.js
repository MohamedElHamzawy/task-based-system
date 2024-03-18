const freelancerModel = require("../../../../DB/freelancer.model");
const statusModel = require("../../../../DB/status.model");
const taskModel = require("../../../../DB/task.model");
const userModel = require("../../../../DB/user.model");
const HttpError = require("../../../../common/httpError");

const assignFreelancer = async (req, res, next) => {
    try {
        const {freelancer, cost} = req.body;
        const taskID = req.params.id;
        if (req.user.user_role != "specialistService" || req.user.user_role != "admin") {
            return next(new HttpError("You are not authorized to add offer to this task!", 401));
        }
        const task = await taskModel.findOne({_id: taskID});
        const statusID = await statusModel.findOne({slug: "assigned"});
        await taskModel.findOneAndUpdate({_id: taskID, accepted: false}, {accepted_by: req.user._id, accepted: true}, {new: true});
        if (cost > 0 && task.cost == 0) {
            await taskModel.findOneAndUpdate({_id: taskID}, {freelancer: freelancer, taskStatus: statusID._id, cost: cost}, {new: true});
        } else {
            await taskModel.findOneAndUpdate({_id: taskID}, {freelancer: freelancer, taskStatus: statusID._id}, {new: true});
        }
        await freelancerModel.findByIdAndUpdate({ _id: freelancer },{ $inc: { tasksCount: 1 } });
        await userModel.findByIdAndUpdate({ _id: task.accepted_by }, { $inc: { tasksCount: 1 } });
        await noteModel.create({task_id: taskID, content: `Freelancer assigned by ${req.user.full_name}`, user_id: req.user._id});
        res.json({message: "Freelancer has been assigned!"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = assignFreelancer