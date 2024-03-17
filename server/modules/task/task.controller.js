const getMyTasks = require("./controllers/getAll.controller");
const getTask = require("./controllers/single.controller");
const FilterTasks = require("./controllers/filter.controller");
const createTask = require("./controllers/create.controller");
const updateTask = require("./controllers/update.controller");
const { assignFreelancer, availablity, cancelTask, deliverTask, doneTask, downloadFile, refuseTask, acceptTask, offerSubmit, ongoing} = require("./controllers/steps.controller");

module.exports = {
    getMyTasks,
    getTask,
    FilterTasks,
    createTask,
    updateTask,
    acceptTask,
    offerSubmit,
    refuseTask,
    availablity,
    assignFreelancer,
    ongoing,
    doneTask,
    downloadFile,
    deliverTask,
    cancelTask
}