const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
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

const noteModel = mongoose.model("note", noteSchema);
module.exports = noteModel;