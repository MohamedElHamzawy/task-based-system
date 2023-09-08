const mongoose = require("mongoose");

const profitSchema = new mongoose.Schema({
    minimum: {
        type: Number,
        default: 10
    },
    maximum: {
        type: Number,
        default: 20
    }
}, {timestamps: true});

const profitModel = mongoose.model("profit", profitSchema);
module.exports = profitModel;