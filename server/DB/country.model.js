const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
    countryName: {
        type: String
    }
}, {timestamps: true});

const countryModel = mongoose.model("country", countrySchema);
module.exports = countryModel;