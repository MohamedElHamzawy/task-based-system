const router = require("express").Router();
const {
    getAllFreelancers, 
    getFreelancer, 
    createFreelancer, 
    updateFreelancer, 
    deleteFreelancer
} = require("./freelancer.controller");

router.get("/", getAllFreelancers);
router.get("/:id", getFreelancer);
router.post("/", createFreelancer);
router.post("/:id", updateFreelancer);
router.delete("/:id", deleteFreelancer);

module.exports = router;