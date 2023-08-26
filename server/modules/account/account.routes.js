const router = require("express").Router();
const {
    getAllAccounts, 
    getAccount
} = require("./account.controller");

router.get("/", getAllAccounts);
router.get("/:id", getAccount);

module.exports = router;