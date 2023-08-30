const router = require("express").Router();
const {createComment, deleteComment} = require("./comment.controller");
const auth = require("../../middleware/auth");

router.post("/", auth(), createComment);
router.delete("/", auth(), deleteComment);

module.exports = router;