const mongoose = require("mongoose");

const freelancerSchema = new mongoose.Schema({
    freelancername: {
        type: String
    },
    phone: {
        type: String
    },
    speciality: {
        type: mongoose.Types.ObjectId,
        ref: "speciality"
    },
    email: {
        type: String,
    },
    country: {
        type: String,
    },
    tasksCount: {
        type: Number,
        default: 0
    },
    completedCount: {
        type: Number,
        default: 0
    },
    totalGain: {
        type: Number,
        default: 0
    },
    totalProfit: {
        type: Number,
        default: 0
    },
    currency: {
        type: mongoose.Types.ObjectId,
        ref: "cuurency"
    }
});

const freelancerModel = mongoose.model("freelancer", freelancerSchema);
module.exports = freelancerModel;