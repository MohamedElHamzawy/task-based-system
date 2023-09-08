const router = require("express").Router();
const {getProfit, createProfit, updateProfit} = require("./profit.controller");

router.get("/", getProfit);
router.post("/", createProfit);
router.post("/:id", updateProfit);

module.exports = router;