const assignFreelancer = require("./steps/assign.freelancer");
const availablity = require("./steps/availability");
const cancelTask = require("./steps/cancel");
const deliverTask = require("./steps/deliver");
const doneTask = require("./steps/done.task");
const downloadFile = require("./steps/file.download");
const {refuseTask, acceptTask} = require("./steps/offer.actions");
const offerSubmit = require("./steps/offer.submit");
const ongoing = require("./steps/ongoing");

module.exports = {
    assignFreelancer,
    availablity,
    cancelTask,
    deliverTask,
    doneTask,
    downloadFile,
    refuseTask,
    acceptTask,
    offerSubmit,
    ongoing
}