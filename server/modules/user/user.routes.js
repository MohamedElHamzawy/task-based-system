const {showAllUsers, 
    getUser, 
    getSortedUsers,
    createUser, 
    updateUser, 
    deleteUser
} = require("./user.controller");
const router = require("express").Router();

router.get("/", showAllUsers);
router.get("/:id", getUser);
router.get("/sort/:sort", getSortedUsers);
router.post("/", createUser);
router.post("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;