const mongoose = require("mongoose");

const specialitySchema = new mongoose.Schema({
    speciality: {
        type: String
    },
    sub_speciality: {
        type: String
    }
}, {timestamps: true});

const specialityModel = mongoose.model("speciality", specialitySchema);
module.exports = specialityModel;