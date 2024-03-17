const statusModel = require("../../../../DB/status.model");
const taskModel = require("../../../../DB/task.model");
const HttpError = require("../../../../common/httpError");

const ongoing = async (req, res, next) => {
    try {
        const taskID = req.params.id;
        statusID = await statusModel.findOne({slug: "on-going"})._id;
        await taskModel.findByIdAndUpdate({_id: taskID}, {taskStatus: statusID});
        res.json({msg: "Done"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = ongoing