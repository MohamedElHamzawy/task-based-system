const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    title: {
        type: String
    },
    transactiontype: {
        type: String
    },
    task: {
        type: mongoose.Types.ObjectId,
        ref: "task"
    },
    amount: {
        type: Number
    },
    account_id : {
        type: mongoose.Types.ObjectId,
        ref: "account"
    }
}, {timestamps: true});

const transactionModel = mongoose.model("transaction", transactionSchema);
module.exports = transactionModel;