const freelancerModel = require("../../../../DB/freelancer.model");
const statusModel = require("../../../../DB/status.model");
const taskModel = require("../../../../DB/task.model");
const userModel = require("../../../../DB/user.model");
const HttpError = require("../../../../common/httpError");

const assignFreelancer = async (req, res, next) => {
    try {
        const {freelancer, cost} = req.body;
        const taskID = req.params.id;
        const task = await taskModel.findOne({_id: taskID});
        const statusID = await statusModel.findOne({slug: "assigned"})._id;
        if (cost > 0 && task.cost == 0) {
            await taskModel.findOneAndUpdate({_id: taskID}, {freelancer: freelancer, taskStatus: statusID, cost: cost}, {new: true});
        } else {
            await taskModel.findOneAndUpdate({_id: taskID}, {freelancer: freelancer, taskStatus: statusID}, {new: true});
        }
        await freelancerModel.findByIdAndUpdate({ _id: freelancer },{ $inc: { tasksCount: 1 } });
        await userModel.findByIdAndUpdate({ _id: task.accepted_by }, { $inc: { tasksCount: 1 } });
        res.json({message: "Freelancer has been assigned!"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = assignFreelancer