const mongoose = require("mongoose");

const freelancerSchema = new mongoose.Schema({
    freelancername: {
        type: String,
        required:true,
        unique: true
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
        type: mongoose.Types.ObjectId,
        ref: "country"
    },
    password: {
        type: String,
        required: true
    },
    user_role:{
        type:String,
        default:"freelancer"
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
        ref: "currency"
    },
    deviceToken:{
        type:String,
    }
});

const freelancerModel = mongoose.model("freelancer", freelancerSchema);
module.exports = freelancerModel;