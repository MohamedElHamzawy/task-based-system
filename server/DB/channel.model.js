const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
    channelname: {
        type: String
    },
    type: {
        type: String
    },
    number: {
        type: String
    },
    description: {
        type: String
    }
}, {timestamps: true});

const channelModel = mongoose.model("channel", channelSchema);
module.exports = channelModel;