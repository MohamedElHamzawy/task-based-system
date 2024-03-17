const statusModel = require("../../../../DB/status.model");
const taskModel = require("../../../../DB/task.model");
const HttpError = require("../../../../common/httpError");

const workingOn = async (req, res, next) => {
    try {
        const taskID = req.params.id;
        const statusID = await statusModel.findOne({slug: "working-on"})._id;
        await taskModel.findOneAndUpdate({_id: taskID, accepted: false}, {accepted_by: req.user._id, accepted: true}, {new: true});
        await taskModel.findOneAndUpdate({_id: taskID}, {taskStatus: statusID}, {new: true});
        res.json({message: "Task has been accepted!"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = workingOn