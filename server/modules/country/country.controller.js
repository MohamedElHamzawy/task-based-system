const countryModel = require("../../DB/country.model");
const HttpError = require("../../common/httpError");

const getAllCountries = async (req,res,next) => {
    try {
        const countries = await countryModel.find({});
        res.json({countries: countries});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const createCountry = async (req,res,next) => {
    try {
        const {countryName} = req.body;
        await new countryModel({countryName: countryName}).save();
        res.json({message: "country added successfully"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const deleteCountry = async (req,res,next) => {
    try {
        const countryID = req.params.id;
        await countryModel.findByIdAndDelete({_id: countryID});
        res.json({message: "country deleted successfully"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = {getAllCountries, createCountry, deleteCountry}