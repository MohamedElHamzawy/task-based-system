const router = require("express").Router();
const auth = require("../../middleware/auth");
const {getNotes} = require("./note.controller");

router.get("/", auth(), getNotes);

module.exports = router;