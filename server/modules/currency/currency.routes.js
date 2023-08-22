const router = require("express").Router();
const {
    getAllCurrencies, 
    getCurrency, 
    createCurrency, 
    updateCurrency, 
    deleteCurrency
} = require("./currency.controller");

router.get("/", getAllCurrencies);
router.get("/:id", getCurrency);
router.post("/", createCurrency);
router.post("/:id", updateCurrency);
router.delete("/:id", deleteCurrency);

module.exports = router;