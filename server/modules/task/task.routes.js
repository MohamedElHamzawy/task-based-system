const router = require("express").Router();
const auth = require("../../middleware/auth");

const {
    getMyTasks, 
    getTask, 
    createTask,
    partialUpdateTask, 
    updateTask, 
    deleteTask
} = require("./task.controller");

router.get("/", auth(), getMyTasks);
router.get("/:id", auth(), getTask);
router.post("/", auth(), createTask);
router.post("/partial/:id", auth(), partialUpdateTask);
router.post("/:id", auth(), updateTask);
router.delete("/:id", auth(), deleteTask);

module.exports = router;