const mongoose = require("mongoose");

const customerProfitSchema = new mongoose.Schema({
    minimum: {
        type: Number,
        default: 10
    },
    maximum: {
        type: Number,
        default: 20
    }
}, {timestamps: true});

const specialistProfitSchema = new mongoose.Schema({
    minimum: {
        type: Number,
        default: 10
    },
    maximum: {
        type: Number,
        default: 20
    }
}, {timestamps: true});

const customerProfitModel = mongoose.model("customerProfit", customerProfitSchema);
const specialistProfitModel = mongoose.model("specialistProfit", specialistProfitSchema);
module.exports = {customerProfitModel, specialistProfitModel};