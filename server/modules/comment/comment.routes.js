const router = require("express").Router();
const {createComment, deleteComment} = require("./comment.controller");

router.post("/", createComment);
router.delete("/", deleteComment);

module.exports = router;