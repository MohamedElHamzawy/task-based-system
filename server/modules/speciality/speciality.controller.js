const specialityModel = require("../../DB/speciality.model");
const HttpError = require("../../common/httpError");

const getAllSpeciality = async (req,res,next) => {
    try {
        const allSpeciality = await specialityModel.find({});
        res.json({specialities: allSpeciality});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const getSpeciality = async (req,res,next) => {
    try {
        const specialityID = req.params.id;
        const thisSpecality = await specialityModel.findById({_id: specialityID});
        res.json({speciality: thisSpecality});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const createSpeciality = async (req,res,next) => {
    try {
        const {
            name,
            type
        } = req.body;
        const tryGetSpeciality = await specialityModel.findOne({specialityName: name});
        if (tryGetSpeciality) {
            return next(new HttpError("Speciality already exist!", 400));
        } else {
            const newSpeciality = await new specialityModel({
                specialityName: name,
                specialityType: type
            }).save();
            res.json({message: "Speciality has been added successfully"});
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const updateSpeciality = async (req,res,next) => {
    try {
        const {
            name,
            type
        } = req.body;
        const specialityID = req.params.id;
        const tryGetSpeciality = await specialityModel.findOne({specialityName: name});
        if (tryGetSpeciality) {
            await specialityModel.findByIdAndUpdate({_id: specialityID}, {specialityName: name, specialityType: type});
            res.json({error: "Speciality has been updated successfully!"});
        } else {
            return next(new HttpError("Speciality doesn't exist on system", 400));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const deleteSpeciality = async (req,res,next) => {
    try {
        const specialityID = req.params.id;
        const tryGetSpeciality = await specialityModel.findOne({_id: specialityID});
        if (tryGetSpeciality) {
            await specialityModel.deleteOne({_id: specialityID});
            res.json({error: "Speciality has been deleted successfully!"});
        } else {
            return next(new HttpError("Speciality doesn't exist on system", 400));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = {getAllSpeciality, getSpeciality, createSpeciality, updateSpeciality, deleteSpeciality}