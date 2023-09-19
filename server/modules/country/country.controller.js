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
        const {countryname} = req.body;
        await new countryModel({countryname: countryname}).save();
        res.json({message: "country added successfully"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = {getAllCountries, createCountry}