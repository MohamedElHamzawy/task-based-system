const router = require("express").Router();
const auth = require("../../middleware/auth");
const {upload}=require("../../middleware/multer")

const {
    getMyTasks,
    getTask,
    FilterTasks,
    createTask,
    updateTask,
    acceptTask,
    workingOn,
    offerSubmit,
    refuseTask,
    availablity,
    assignFreelancer,
    ongoing,
    doneTask,
    downloadFile,
    deliverTask,
    cancelTask
} = require("./task.controller");

router.get("/", auth(), getMyTasks);
router.get("/:id", auth(), getTask);
router.post("/filter/result/", FilterTasks);
router.post("/", auth(), createTask);
router.post("/action/accept/:id", auth(), acceptTask);
router.post("/action/working/:id", auth(), workingOn);
router.post("/action/offer/:id", auth(), offerSubmit);
router.post("/action/refuse/:id", auth(), refuseTask);
router.post("/action/availablity/:id", auth(), availablity);
router.post("/action/assign/:id", auth(), assignFreelancer);
router.post("/action/ongoing/:id", auth(), ongoing);
router.post("/action/done/:id", auth(), upload.single('file'), doneTask);
router.post("/action/deliver/:id", auth(), deliverTask);
router.post("/action/cancel/:id", auth(), cancelTask);
router.post("/:id", auth(), updateTask);
router.get("/file/:id", auth(), downloadFile);



module.exports = router;