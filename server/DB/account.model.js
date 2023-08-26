const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId
    },
    title: {
        type: String
    },
    balance: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

const accountModel = mongoose.model("account", accountSchema);
module.exports = accountModel;