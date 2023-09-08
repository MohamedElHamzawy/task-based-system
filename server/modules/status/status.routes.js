const router = require("express").Router();
const auth = require("../../middleware/auth");
const {
    getAllStatuses, 
    getStatus, 
    createStatus, 
    updateStatus,
    deleteStatus
} = require("./status.controller");

router.get("/", auth(), getAllStatuses);
router.get("/:id", getStatus);
router.post("/", createStatus);
router.post("/:id", updateStatus);
router.delete("/:id", deleteStatus);

module.exports = router;