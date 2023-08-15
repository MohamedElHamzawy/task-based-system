const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema({
    currencyname: {
        type: String
    },
    priceToEGP: {
        type: Number
    }
}, {timestamps: true});

const currencyModel = mongoose.model("currency", currencySchema);
module.exports = currencyModel;