const fileModel = require("../../../../DB/file.model");
const HttpError = require("../../../../common/httpError");

const downloadFile = async (req, res, next) => {
  try {
    const taskID = req.params.id;
    if (
      req.user.user_role != "customerService" &&
      req.user.user_role != "admin"
    ) {
      return next(
        new HttpError("You are not authorized to add offer to this task!", 401)
      );
    }
    const file = await fileModel.findOne({ taskId: taskID });
    if (file) {
      const rootFolder = process.cwd();
      const filePath = `${rootFolder}/${file.filePath}`;
      res.download(filePath);
    } else {
      return next(new HttpError("file not found", 404));
    }
  } catch (error) {
    return next(new HttpError(`Unexpected Error: ${error}`, 500));
  }
};

module.exports = downloadFile;
