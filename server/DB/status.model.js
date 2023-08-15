const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
    statusname: {
        type: String
    },
    slug: {
        type: String
    }
}, {timestamps: true});

const statusModel = mongoose.model("status", statusSchema);
module.exports = statusModel;