const router = require("express").Router();
const {getAllAccounts, 
    getAccount, 
    createAccount, 
    updateAccount, 
    deleteAccount
} = require("./account.controller");

router.get("/", getAllAccounts);
router.get("/:id", getAccount);

module.exports = router;