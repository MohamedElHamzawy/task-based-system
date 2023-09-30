const router = require("express").Router();
const {getAllCountries, createCountry, deleteCountry} = require("./country.controller");

router.get("/", getAllCountries);
router.post("/", createCountry);
router.delete("/:id", deleteCountry);

module.exports = router;