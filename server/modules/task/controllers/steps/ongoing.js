const statusModel = require("../../../../DB/status.model");
const taskModel = require("../../../../DB/task.model");
const HttpError = require("../../../../common/httpError");

const ongoing = async (req, res, next) => {
    try {
        const taskID = req.params.id;
        if (req.user.user_role != "freelancer" || req.user.user_role != "admin" || req.user.user_role != "specialistService") {
            return next(new HttpError("You are not authorized to add offer to this task!", 401));
        }
        const statusID = await statusModel.findOne({slug: "on-going"});
        await taskModel.findByIdAndUpdate({_id: taskID}, {taskStatus: statusID._id});
        await noteModel.create({task_id: taskID, content: `Task is under process by ${req.user.full_name}`, user_id: req.user._id});
        res.json({msg: "Done"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = ongoing