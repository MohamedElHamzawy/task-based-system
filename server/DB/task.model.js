const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    channel: {
        type: String
    },
    client: {
        type: mongoose.Types.ObjectId,
        ref: "client"
    },
    freelancer: {
        type: mongoose.Types.ObjectId,
        ref: "freelancer"
    },
    speciality: {
        type: mongoose.Types.ObjectId,
        ref: "speciality"
    },
    taskStatus: {
        type: mongoose.Types.ObjectId,
        ref: "status"
    },
    deadline: {
        type: Date
    },
    created_by: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    accepted_by: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    accepted: {
        type: Boolean,
        default: false
    },
    task_currency:{
        type: mongoose.Types.ObjectId,
        ref: "currency"
    },
    paid: {
        type: Number
    },
    cost: {
        type: Number
    },
    profit_amount: {
        type: Number
    }
}, {timestamps: true});

const taskModel = mongoose.model("task", taskSchema);
module.exports = taskModel;