const counrtyModel = require("../../DB/country.model");
const HttpError = require("../../common/httpError");

const getAllCountries = async (req,res,next) => {
    try {
        const countries = await counrtyModel.find({});
        res.json({countries: countries});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const createCountry = async (req,res,next) => {
    try {
        const {counrtyname} = req.body;
        await new counrtyModel({counrtyname: counrtyname}).save();
        res.json({message: "country added successfully"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = {getAllCountries, createCountry}