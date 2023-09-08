const router = require("express").Router();
const {createProfit, updateProfit} = require("./profit.controller");

router.post("/", createProfit);
router.post("/:id", updateProfit);

module.exports = router;