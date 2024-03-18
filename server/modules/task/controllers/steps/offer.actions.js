const statusModel = require("../../../../DB/status.model");
const taskModel = require("../../../../DB/task.model");
const HttpError = require("../../../../common/httpError");

const refuseTask = async (req, res, next) => {
    try {
        const taskID = req.params.id;
        if (req.user.user_role != "customerService" || req.user.user_role != "admin") {
            return next(new HttpError("You are not authorized to add offer to this task!", 401));
        }
        const statusID = await statusModel.findOne({slug: "rejected"});
        await taskModel.findOneAndUpdate({_id: taskID}, {taskStatus: statusID._id, cost: 0}, {new: true});
        await noteModel.create({task_id: taskID, content: `Offer Refused by ${req.user.full_name}`, user_id: req.user._id});
        res.json({message: "Task has been refused!"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const acceptTask = async (req, res, next) => {
    try {
        const taskID = req.params.id;
        const {paid} = req.body;
        if (req.user.user_role != "customerService" || req.user.user_role != "admin") {
            return next(new HttpError("You are not authorized to add offer to this task!", 401));
        }
        const statusID = await statusModel.findOne({slug: "approved"});
        await taskModel.findOneAndUpdate({_id: taskID}, {paid: paid, taskStatus: statusID._id}, {new: true});
        await noteModel.create({task_id: taskID, content: `Offer Approved by ${req.user.full_name}`, user_id: req.user._id});
        res.json({message: "Task has been accepted!"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = {
    refuseTask,
    acceptTask
}