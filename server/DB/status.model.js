const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
    statusname: {
        type: String
    },
    slug: {
        type: String
    },
    role: {
        type: String
    },
    changable: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

const statusModel = mongoose.model("status", statusSchema);
module.exports = statusModel;