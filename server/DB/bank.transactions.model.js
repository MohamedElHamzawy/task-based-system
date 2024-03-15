const mongoose = require("mongoose");

const bankTransactionSchema = new mongoose.Schema({
    from: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    to: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    exchangeRate: {
        type: Number
    },
    amount: {
        type: Number,
        required: true
    }
}, {timestamps: true});

const bankTransactionModel = mongoose.model("bankTransaction", bankTransactionSchema);
module.exports = bankTransactionModel