const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    clientname: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    country: {
        type: String,
    },
    city: {
        type: String,
    },
}, {timestamps: true});
const clientModel = mongoose.model("client", clientSchema);
module.exports = clientModel;