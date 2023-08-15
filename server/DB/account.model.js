const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    title: {
        type: String
    },
    cost: {
        type: Number
    },
    gain: {
        type: Number
    }
}, {timestamps: true});

const accountModel = mongoose.model("account", accountSchema);
module.exports = accountModel;