const router = require("express").Router();
const {getCustomerProfit, createCustomerProfit, updateCustomerProfit, getspecialistProfit, createspecialistProfit, updatespecialistProfit} = require("./profit.controller");

router.get("/customer", getCustomerProfit);
router.post("/customer", createCustomerProfit);
router.post("/customer/:id", updateCustomerProfit);

router.get("/specialist", getspecialistProfit);
router.post("/specialist", createspecialistProfit);
router.post("/specialist/:id", updatespecialistProfit);

module.exports = router;