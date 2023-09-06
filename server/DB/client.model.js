const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    clientname: {
        type: String,
    },
    phone: {
        type: String,
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
}, {timestamps: true});
const clientModel = mongoose.model("client", clientSchema);
module.exports = clientModel;