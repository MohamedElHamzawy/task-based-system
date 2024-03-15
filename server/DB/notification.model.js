const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref:"user"
    },
    deviceToken:{
        type:String,
    }
});

const notificationModel = mongoose.model("notification", notificationSchema);
module.exports = notificationModel;