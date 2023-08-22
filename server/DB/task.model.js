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
    specialist: {
        type: mongoose.Types.ObjectId,
        ref: "user"
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
    demand_price: {
        type: Number
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
        type: Number
    },
    profit_amount: {
        type: Number
    },
    profit_currency: {
        type: mongoose.Types.ObjectId,
        ref: "currency"
    },
    payment_account: {
        type: mongoose.Types.ObjectId,
        ref: "account"
    }
}, {timestamps: true});

const taskModel = mongoose.model("task", taskSchema);
module.exports = taskModel;