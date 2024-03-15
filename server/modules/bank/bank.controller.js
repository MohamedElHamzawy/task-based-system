const bankModel = require("../../DB/bank.model");
const HttpError = require("../../common/httpError");

const getAllBanks = async (req, res, next) => {
    try {
        const banks = await bankModel.find().populate("currency");
        res.status(200).json(banks);
    } catch (err) {
        return next(new HttpError(`Unexpected Error: ${err}`, 500));
    }
};

const getBank = async (req, res, next) => {
    try {
        const bank = await bankModel.findById(req.params.id).populate("currency");
        res.status(200).json(bank);
    } catch (err) {
        return next(new HttpError(`Unexpected Error: ${err}`, 500));
    }
};

const createBank = async (req, res, next) => {
    try {
        const bank = await bankModel.create(req.body);
        res.status(200).json(bank);
    } catch (err) {
        return next(new HttpError(`Unexpected Error: ${err}`, 500));
    }
};

const updateBank = async (req, res, next) => {
    try {
        const bank = await bankModel.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json(bank);
    } catch (err) {
        return next(new HttpError(`Unexpected Error: ${err}`, 500));
    }
};

const deleteBank = async (req, res, next) => {
    try {
        const bank = await bankModel.findByIdAndDelete(req.params.id);
        res.status(200).json(bank);
    } catch (err) {
        return next(new HttpError(`Unexpected Error: ${err}`, 500));
    }
};

module.exports = {
    getAllBanks,
    getBank,
    createBank,
    updateBank,
    deleteBank
}