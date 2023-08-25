const router = require("express").Router();

const {
    getMyTasks, 
    getTask, 
    createTask, 
    acceptTask, 
    confirmTask, 
    progressTask, 
    completeTask, 
    deliverTask
} = require("./task.controller");

router.get("/", getMyTasks);
router.get("/:id", getTask);
router.post("/", createTask);
router.post("/accept/:id", acceptTask);
router.post("/confirm/:id", confirmTask);
router.post("/progress/:id", progressTask);
router.post("/complete/:id", completeTask);
router.post("/deliver/:id", deliverTask);

module.exports = router;