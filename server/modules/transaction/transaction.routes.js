const router = require("express").Router();
const {getAllTransactions, getTransaction, createTransaction, deleteTransaction} = require("./transaction.controller");

router.get("/", getAllTransactions);
router.get("/:id", getTransaction);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;