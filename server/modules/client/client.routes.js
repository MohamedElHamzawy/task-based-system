const {getAllClients, 
    getClient, 
    filterSortedClients,
    createClient, 
    updateClient, 
    deleteClient
} = require("./client.controller");
const router = require("express").Router();

router.get("/", getAllClients);
router.get("/:id", getClient);
router.get("/sort/filter/", filterSortedClients);
router.post("/", createClient);
router.post("/:id", updateClient);
router.delete("/:id", deleteClient);

module.exports = router;