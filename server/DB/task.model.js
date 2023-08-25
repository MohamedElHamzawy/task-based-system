const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    channel: {
        type: String
    },
    client_id: {
        type: mongoose.Types.ObjectId,
        ref: "client"
    },
    freelancer: {
        type: mongoose.Types.ObjectId,
        ref: "freelancer"
    },
    description: {
        type: String
    },
    speciality: {
        type: mongoose.Types.ObjectId,
        ref: "speciality"
    },
    taskstatus: {
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
    task_price: {
        type: Number
    },
    task_currency:{
        type: mongoose.Types.ObjectId,
        ref: "currency"
    },
    demand_price: {
        type: Number
    },
    demand_currency:{
        type: mongoose.Types.ObjectId,
        ref: "currency"
    },
    paid_by_client: {
        type: Number
    },
    paid_currency:{
        type: mongoose.Types.ObjectId,
        ref: "currency"
    },
    cost_price: {
        type: Number
    },
    cost_currency: {
        type: mongoose.Types.ObjectId,
        ref: "currency"
    },
    profit_percentage: {
        type: Number,
        default: 10
    },
    profit_amount: {
        type: Number
    },
    profit_currency: {
        type: mongoose.Types.ObjectId,
        ref: "currency"
    }
}, {timestamps: true});

const taskModel = mongoose.model("task", taskSchema);
module.exports = taskModel;