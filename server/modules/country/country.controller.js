const counrtyModel = require("../../DB/country.model");

const getAllCountries = async (req,res,next) => {
    const countries = await counrtyModel.find({});
    res.json({countries: countries});
}

const createCountry = async (req,res,next) => {
    const {counrtyname} = req.body;
    await new counrtyModel({counrtyname: counrtyname}).save();
    res.json({message: "country added successfully"});
}

module.exports = {getAllCountries, createCountry}