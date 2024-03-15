const router = require("express").Router();
const {storeDeviceToken} = require("./notification.controller");
const auth = require("../../middleware/auth");


router.post("/",auth(),storeDeviceToken);

module.exports = router;