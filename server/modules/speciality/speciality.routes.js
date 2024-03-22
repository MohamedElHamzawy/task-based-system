const {getAllSpeciality, 
    getAllSpecialities,
    getSpeciality, 
    createSpeciality, 
    updateSpeciality, 
    deleteSpeciality
} = require("./speciality.controller");
const router = require("express").Router();

router.get("/", getAllSpeciality);
router.get("/all/", getAllSpecialities);
router.get("/:id", getSpeciality);
router.post("/", createSpeciality);
router.post("/:id", updateSpeciality);
router.delete("/:id", deleteSpeciality);

module.exports = router;