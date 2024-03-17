const fileModel = require("../../../../DB/file.model");
const statusModel = require("../../../../DB/status.model");
const taskModel = require("../../../../DB/task.model");
const HttpError = require("../../../../common/httpError");

const pushFile = async (fileName,filePath,fileType,fileSize,taskId) => {
    try {
        await fileModel.findOneAndDelete({taskId: taskId});
        const file = new fileModel({
          taskId:taskId,
          fileName: fileName,
          filePath: filePath,
          fileType: fileType,
          fileSize: fileSize,
        }).save();
        return file
      } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
      }
}
const fileSizeFormatter = (bytes, decimal) => {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const dm = decimal || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return (
      parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
    );
};
const doneTask = async (req, res, next) => {
    try {
        const taskID = req.params.id;
        const statusID = await statusModel.findOne({slug: "done"})._id;
        await pushFile(req.file.originalname, req.file.path, req.file.mimetype, fileSizeFormatter(req.file.size, 2), taskID);
        await taskModel.findOneAndUpdate({_id: taskID}, {taskStatus: statusID}, {new: true});
        res.json({message: "Task has been Finished!"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = doneTask