const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    serialNumber: {
        type: String
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
    country: {
        type: mongoose.Types.ObjectId,
        ref: "country"
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
    show_created: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    show_accepted: {
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