const router = require("express").Router();
const {createComment, deleteComment} = require("./comment.controller");
const auth = require("../../middleware/auth");

router.post("/", auth(), createComment);
router.delete("/", deleteComment);

module.exports = router;