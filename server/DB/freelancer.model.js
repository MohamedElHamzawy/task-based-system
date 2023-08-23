const mongoose = require("mongoose");

const freelancerSchema = new mongoose.Schema({
    freelancername: {
        type: String
    },
    phone: {
        type: String
    },
    speciality: {
        type: mongoose.Types.ObjectId,
        ref: "speciality"
    }
});

const freelancerModel = mongoose.model("freelancer", freelancerSchema);
module.exports = freelancerModel;