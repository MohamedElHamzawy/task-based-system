const statusModel = require("../../../../DB/status.model");
const taskModel = require("../../../../DB/task.model");
const HttpError = require("../../../../common/httpError");

const availablity = async (req, res, next) => {
  try {
    const taskID = req.params.id;
    if (
      req.user.user_role != "specialistService" &&
      req.user.user_role != "admin"
    ) {
      return next(
        new HttpError("You are not authorized to add offer to this task!", 401)
      );
    }
    const statusID = await statusModel.findOne({ slug: "not-available" });
    await taskModel.findOneAndUpdate(
      { _id: taskID },
      { taskStatus: statusID._id },
      { new: true }
    );
    await noteModel.create({
      task_id: taskID,
      content: `No available freelancers by ${req.user.full_name}`,
      user_id: req.user._id,
    });
    res.json({ message: "Task has been Updated!" });
  } catch (error) {
    return next(new HttpError(`Unexpected Error: ${error}`, 500));
  }
};

module.exports = availablity;
