const specialityModel = require("../../DB/speciality.model");

const getAllSpeciality = async (req,res,next) => {
    const allSpeciality = await specialityModel.find({});
    res.json({specialities: allSpeciality});
}

const getSpeciality = async (req,res,next) => {
    const {specialityID} = req.params;
    const thisSpecality = await specialityModel.findById({_id: specialityID});
    res.json({speciality: thisSpecality});
}

const createSpeciality = async (req,res,next) => {
    const {
        name,
        type
    } = req.body;
    const tryGetSpeciality = await specialityModel.findOne({specialityName: name});
    if (tryGetSpeciality) {
        res.json({error: "Speciality already exist!"});
    } else {
        const newSpeciality = new specialityModel({
            specialityName: name,
            specialityType: type
        }).save();
        res.json({message: "Speciality has been added successfully"});
    }
}

const updateSpeciality = async (req,res,next) => {
    const {
        name,
        type
    } = req.body;
    const {specialityID} = req.params;
    const tryGetSpeciality = await specialityModel.findOne({specialityName: name});
    if (tryGetSpeciality) {
        await specialityModel.findByIdAndUpdate({_id: specialityID}, {specialityName: name, specialityType: type});
        res.json({error: "Speciality has been updated successfully!"});
    } else {
        res.json({error: "Speciality doesn't exist on system"});
    }
}

const deleteSpeciality = async (req,res,next) => {
    const {specialityID} = req.params;
    const tryGetSpeciality = await specialityModel.findOne({_id: specialityID});
    if (tryGetSpeciality) {
        await specialityModel.deleteOne({_id: specialityID});
        res.json({error: "Speciality has been deleted successfully!"});
    } else {
        res.json({error: "Speciality doesn't exist on system"});
    }
}