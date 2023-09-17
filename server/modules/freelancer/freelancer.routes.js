const router = require("express").Router();
const {
    getAllFreelancers, 
    getFreelancer, 
    filterSortedFreelancers,
    createFreelancer, 
    updateFreelancer, 
    deleteFreelancer
} = require("./freelancer.controller");

router.get("/", getAllFreelancers);
router.get("/:id", getFreelancer);
router.get("/sort", filterSortedFreelancers);
router.post("/", createFreelancer);
router.post("/:id", updateFreelancer);
router.delete("/:id", deleteFreelancer);

module.exports = router;