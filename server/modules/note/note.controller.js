const noteModel = require("../../DB/note.model");
const taskModel = require("../../DB/task.model");
const HttpError = require("../../common/httpError");

const getNotes = async (req,res,next) => {
    try {
        const role = req.user.user_role;
        if (role == "admin") {
            const notes = await noteModel.find({}).sort({createdAt: -1}).populate(["user_id", "task_id"]);
            res.json({notes: notes});
        } else if (role == "customerService") {
            const tasksId = await taskModel.find({created_by: req.user._id}).select("_id");
            const notes = await noteModel.find({task_id: {$in: tasksId}}).sort({createdAt: -1}).populate(["user_id", "task_id"]);
            res.json({notes: notes});
        } else if (role == "specialistService") {
            const tasksId = await taskModel.find({accepted_by: req.user._id}).select("_id");
            const notes = await noteModel.find({task_id: {$in: tasksId}}).sort({createdAt: -1}).populate(["user_id", "task_id"]);
            res.json({notes: notes});
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = {getNotes};