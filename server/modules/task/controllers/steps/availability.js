const statusModel = require("../../../../DB/status.model");
const taskModel = require("../../../../DB/task.model");
const HttpError = require("../../../../common/httpError");


const availablity = async (req, res, next) => {
    try {
        const taskID = req.params.id;
        const statusID = await statusModel.findOne({slug: "not-available"})._id;
        await taskModel.findOneAndUpdate({_id: taskID}, {taskStatus: statusID}, {new: true});
        res.json({message: "Task has been Updated!"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = availablity