const commentModel = require("../../DB/comment.model");
const HttpError = require("../../common/httpError");

const createComment = async (req,res,next) => {
    try {
        const user_id = req.user._id;
        const {content, task_id} = req.body;
        await new commentModel({content: content, user_id: user_id, task_id: task_id}).save();
        const comments = await commentModel.find({task_id: task_id});
        res.json({message: "Comment has been added successfully", comments:comments});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const deleteComment = async (req,res,next) => {
    try {
        const {commentID} = req.body;
        const user_id = req.user._id;
        const tryGetThisComment = await commentModel.findOne({$and: [{_id: commentID}, {user_id: user_id}]});
        if (tryGetThisComment) {
            await commentModel.findByIdAndDelete({_id: commentID});
            res.json({message: "This comment has been deleted successfully"});
        } else {
            return next(new HttpError("You can't delete this comment", 401));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = {createComment, deleteComment}