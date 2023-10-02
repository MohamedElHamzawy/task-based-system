const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema({
    currencyname: {
        type: String
    },
    priceToEGP: {
        type: Number
    },
    expired: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const currencyModel = mongoose.model("currency", currencySchema);
module.exports = currencyModel;