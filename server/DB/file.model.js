const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fileSchema = new Schema({
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    fileSize: {
        type: String,
        required: true
    },
    taskId:{
        type: mongoose.Types.ObjectId,
        ref: "task"
    },
}, {timestamps: true});

const fileModel = mongoose.model('file', fileSchema);
module.exports = fileModel