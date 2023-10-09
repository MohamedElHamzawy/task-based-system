const router = require("express").Router();
const auth = require("../../middleware/auth");
const {
    getAllStatuses, 
    getStatus, 
    createStatus, 
    updateStatus,
    deleteStatus,
    getAllStatusesFilter
} = require("./status.controller");

router.get("/", auth(), getAllStatuses);
router.get("/filter/all/", getAllStatusesFilter);
router.get("/:id", getStatus);
router.post("/", createStatus);
router.post("/:id", updateStatus);
router.delete("/:id", deleteStatus);

module.exports = router;