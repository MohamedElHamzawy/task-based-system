const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
    countryname: {
        type: String
    }
}, {timestamps: true});

const countryModel = mongoose.model("country", countrySchema);
module.exports = countryModel;