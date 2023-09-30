const router = require("express").Router();
const auth = require("../../middleware/auth");

const {
    getMyTasks, 
    getTask, 
    FilterTasks,
    FilterTasksA,
    FilterTasksB,
    createTask,
    partialUpdateTask, 
    updateTask, 
    deleteTask
} = require("./task.controller");

router.get("/", auth(), getMyTasks);
router.get("/:id", auth(), getTask);
router.post("/filter/result/", FilterTasks);
router.post("/filter/result/customer", auth(), FilterTasksA);
router.post("/filter/result/specialist", auth(), FilterTasksB);
router.post("/", auth(), createTask);
router.post("/partial/:id", auth(), partialUpdateTask);
router.post("/:id", auth(), updateTask);
router.delete("/:id", auth(), deleteTask);

module.exports = router;