const router = require("express").Router();
const {getAllAccounts, 
    getAccount, 
    createAccount, 
    updateAccount, 
    deleteAccount
} = require("./account.controller");

router.get("/", getAllAccounts);
router.get("/:id", getAccount);
router.post("/", createAccount);
router.post("/:id", updateAccount);
router.delete("/:id", deleteAccount);

module.exports = router;