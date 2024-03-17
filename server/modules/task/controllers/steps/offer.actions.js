const statusModel = require("../../../../DB/status.model");
const taskModel = require("../../../../DB/task.model");
const HttpError = require("../../../../common/httpError");

const refuseTask = async (req, res, next) => {
    try {
        const taskID = req.params.id;
        const statusID = await statusModel.findOne({slug: "rejected"})._id;
        await taskModel.findOneAndUpdate({_id: taskID}, {taskStatus: statusID, cost: 0}, {new: true});
        res.json({message: "Task has been refused!"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const acceptTask = async (req, res, next) => {
    try {
        const taskID = req.params.id;
        const {paid} = req.body;
        const statusID = await statusModel.findOne({slug: "approved"})._id;
        await taskModel.findOneAndUpdate({_id: taskID}, {paid: paid, taskStatus: statusID}, {new: true});
        res.json({message: "Task has been accepted!"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = {
    refuseTask,
    acceptTask
}