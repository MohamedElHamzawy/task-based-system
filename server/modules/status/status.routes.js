const router = require("express").Router();
const {
    getAllStatuses, 
    getStatus, 
    createStatus, 
    updateStatus,
    deleteStatus
} = require("./status.controller");

router.get("/", getAllStatuses);
router.get("/:id", getStatus);
router.post("/", createStatus);
router.post("/:id", updateStatus);
router.delete("/:id", deleteStatus);

module.exports = router;