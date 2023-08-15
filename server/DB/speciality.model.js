const mongoose = require("mongoose");

const specialitySchema = new mongoose.Schema({
    specialityName: {
        type: String
    },
    specialityType: {
        type: String
    }
}, {timestamps: true});

const specialityModel = mongoose.model("speciality", specialitySchema);
module.exports = specialityModel;