const {
    showAllUsers, 
    getCustomerService,
    getSpecialistService,
    getUser, 
    filterSortedUsers,
    createUser, 
    updateUser, 
    deleteUser
} = require("./user.controller");
const router = require("express").Router();

router.get("/", showAllUsers);
router.get("/customerService", getCustomerService);
router.get("/specialistService", getSpecialistService);
router.get("/:id", getUser);
router.get("/sort/filter/", filterSortedUsers);
router.post("/", createUser);
router.post("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;