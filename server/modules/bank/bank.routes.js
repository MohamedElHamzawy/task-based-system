const router = require("express").Router();
const auth = require("../../middleware/auth");
const {getAllBanks, getBank, createBank, updateBank, deleteBank} = require("./bank.controller");

router.get("/", auth(), getAllBanks);
router.get("/:id", auth(), getBank);
router.post("/", auth(), createBank);
router.post("/:id", auth(), updateBank);
router.delete("/:id", auth(), deleteBank);

module.exports = router;