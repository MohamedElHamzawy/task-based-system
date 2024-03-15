const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

const bankModel = mongoose.model("bank", bankSchema);
module.exports = bankModel;