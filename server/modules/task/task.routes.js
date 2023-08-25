const router = require("express").Router();
const auth = require("../../middleware/auth");

const {
    getMyTasks, 
    getTask, 
    createTask, 
    acceptTask, 
    confirmTask, 
    progressTask, 
    completeTask, 
    deliverTask,
    updateTask,
    deleteTask
} = require("./task.controller");

router.get("/", auth(), getMyTasks);
router.get("/:id", auth(), getTask);
router.post("/", auth(), createTask);
router.post("/accept/:id", auth(), acceptTask);
router.post("/confirm/:id", auth(), confirmTask);
router.post("/progress/:id", auth(), progressTask);
router.post("/complete/:id", auth(), completeTask);
router.post("/deliver/:id", auth(), deliverTask);
router.post("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;