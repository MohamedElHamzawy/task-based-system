const userLogin = require("./login.controller");
const router = require("express").Router();

router.post("/login", userLogin);

module.exports = router;