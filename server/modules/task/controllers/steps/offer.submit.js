const statusModel = require("../../../../DB/status.model");
const taskModel = require("../../../../DB/task.model");
const HttpError = require("../../../../common/httpError");

const offerSubmit = async (req, res, next) => {
    try {
        const taskID = req.params.id;
        const {cost} = req.body;
        if (req.user.user_role != "specialistService" || req.user.user_role != "admin") {
            return next(new HttpError("You are not authorized to add offer to this task!", 401));
        }
        if (cost <= 0) {
            return next(new HttpError("Task cost must be greater than zero!", 400));
        }

        const statusID = await statusModel.findOne({slug: "offer-submitted"})._id;
        await taskModel.findOneAndUpdate({_id: taskID, accepted: false}, {accepted_by: req.user._id, accepted: true}, {new: true});
        await taskModel.findOneAndUpdate({_id: taskID}, {cost: cost, taskStatus: statusID}, {new: true});
        res.json({message: "Task has been accepted!"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = offerSubmit