const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    task_id: {
        type: mongoose.Types.ObjectId,
        ref: "task",
        required: true
    }
}, {timestamps: true});

const commentModel = mongoose.model("comment", commentSchema);
module.exports = commentModel;