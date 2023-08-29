const currencyModel = require("../../DB/currency.model");
const HttpError = require("../../common/httpError");

const getAllCurrencies = async (req,res,next) => {
    const currencies = await currencyModel.find({});
    res.json({currencies: currencies});
}

const getCurrency = async (req,res,next) => {
    const currencyID = req.params.id;
    const thisCurrency = await currencyModel.findById({_id: currencyID});
    if (thisCurrency) {
        res.json({message: thisCurrency});
    } else {
        return next(new HttpError("This currency doesn't exist", 400));
    }
}

const createCurrency = async (req,res,next) => {
    const {name,price} = req.body;
    const tryGetThisCurrency = await currencyModel.findOne({currencyname:name});
    if (tryGetThisCurrency) {
        return next(new HttpError("This currency already exists!", 400));
    } else {
        await new currencyModel({currencyname:name, priceToEGP:price}).save();
        res.json({message:"Currency has been created successfully"});
    }
}

const updateCurrency = async (req,res,next) => {
    const {name, price} = req.body;
    const currencyID = req.params.id;
    const tryGetThisCurrency = await currencyModel.findOne({currencyname:name});
    if (tryGetThisCurrency) {
        await currencyModel.findByIdAndUpdate({_id: currencyID}, {currencyname:name, priceToEGP: price});
        res.json({message:"Currency has been updated successfully"});
    } else {
        return next(new HttpError("This currency doesn't exist on system!", 400));
    }
}

const deleteCurrency = async (req,res,next) => {
    const currencyID = req.params.id;
    const tryGetThisCurrency = await currencyModel.findOne({_id:currencyID});
    if (tryGetThisCurrency) {
        await currencyModel.findByIdAndDelete({_id: currencyID});
        res.json({message:"Currecy has been deleted successfully"});
    } else {
        return next(new HttpError("This currency doesn't exist on system!", 400));
    }
}
module.exports = {getAllCurrencies, getCurrency, createCurrency, updateCurrency, deleteCurrency}