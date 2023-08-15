const mongoose = require("mongoose");

const gainingSchema = new mongoose.Schema({
    title: {
        type: String
    },
    gainingtype: {
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

const gainingModel = mongoose.model("gaining", gainingSchema);
module.exports = gainingModel;