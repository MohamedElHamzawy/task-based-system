const mongoose = require("mongoose");

const spendingSchema = new mongoose.Schema({
    title: {
        type: String
    },
    spendingtype: {
        type: String
    },
    amount: {
        type: Number
    },
    account_id : {
        type: mongoose.Types.ObjectId,
        ref: "account"
    }
}, {timestamps: true});

const spendingModel = mongoose.model("spending", spendingSchema);
module.exports = spendingModel;