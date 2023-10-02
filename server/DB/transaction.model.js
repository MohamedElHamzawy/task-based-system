const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    transactionType: {
        type: String
    },
    method: {
        type: String
    },
    accountNumber: {
        type: String,
        default: "0"
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