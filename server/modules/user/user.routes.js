const {showAllUsers, 
    getUser, 
    createUser, 
    updateUser, 
    deleteUser
} = require("./user.controller");
const router = require("express").Router();

router.get("/", showAllUsers);
router.get("/:id", getUser);
router.post("/", createUser);
router.post("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;