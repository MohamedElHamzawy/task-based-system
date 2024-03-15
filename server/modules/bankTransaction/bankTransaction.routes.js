const router = require("express").Router();
const auth = require("../../middleware/auth");
const {getAllBankTransactions, getBankTransaction, createBankTransaction, deleteBankTransaction} = require("./bankTransaction.controller");

router.get("/", auth(), getAllBankTransactions);
router.get("/:id", auth(), getBankTransaction);
router.post("/", auth(), createBankTransaction);
router.delete("/:id", auth(), deleteBankTransaction);

module.exports = router