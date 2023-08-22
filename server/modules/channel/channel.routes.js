const router = require("express").Router();
const {
    getAllChannels, 
    getChannel, 
    createChannel, 
    updateChannel, 
    deleteChannel
} = require("./channel.controller");

router.get("/", getAllChannels);
router.get("/:id", getChannel);
router.post("/", createChannel);
router.post("/:id", updateChannel);
router.delete("/:id", deleteChannel);

module.exports = router;