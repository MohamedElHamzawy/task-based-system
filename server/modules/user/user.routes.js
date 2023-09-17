const {
    showAllUsers, 
    getCustomerService,
    getUser, 
    filterSortedUsers,
    createUser, 
    updateUser, 
    deleteUser
} = require("./user.controller");
const router = require("express").Router();

router.get("/", showAllUsers);
router.get("/customerService", getCustomerService);
router.get("/:id", getUser);
router.get("/sort", filterSortedUsers);
router.post("/", createUser);
router.post("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;