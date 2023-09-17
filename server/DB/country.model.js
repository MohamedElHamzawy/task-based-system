const mongoose = require("mongoose");

const counrtySchema = new mongoose.Schema({
    counrtyname: {
        type: String
    }
}, {timestamps: true});

const counrtyModel = mongoose.model("counrty", counrtySchema);
module.exports = counrtyModel;