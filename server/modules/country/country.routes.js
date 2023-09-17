const router = require("express").Router();
const {getAllCountries, createCountry} = require("./country.controller");

router.get("/", getAllCountries);
router.post("/", createCountry);

module.exports = router;