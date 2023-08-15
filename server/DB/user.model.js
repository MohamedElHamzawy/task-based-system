const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: {
        type : String,
        requiered : true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    user_role: {
        type: String,
        required: true
    },
    user_type: {
        type: String
    },
    country: {
        type: String
    },
    phone: {
        type: String
    },
    speciality: {
        type: mongoose.Types.ObjectId,
        ref: "speciality"
    }
}, {timestamps: true});
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;