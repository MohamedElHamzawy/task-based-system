const router = require("express").Router();
const auth = require("../../middleware/auth");

const {
    getMyTasks, 
    getTask, 
    createTask, 
    addOffer, 
    addPercentage, 
    refuseTask, 
    confirmTask, 
    completeTask, 
    deliverTask, 
    updateTask, 
    deleteTask
} = require("./task.controller");

router.get("/", auth(), getMyTasks);
router.get("/:id", auth(), getTask);
router.post("/", auth(), createTask);
router.post("/addOffer/:id", auth(), addOffer);
router.post("/addPercentage/:id", auth(), addPercentage);
router.post("/confirm/:id", auth(), confirmTask);
router.post("/refuse/:id", auth(), refuseTask);
router.post("/complete/:id", auth(), completeTask);
router.post("/deliver/:id", auth(), deliverTask);
router.post("/:id", auth(), updateTask);
router.delete("/:id", auth(), deleteTask);

module.exports = router;