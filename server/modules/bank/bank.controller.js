const bankModel = require("../../DB/bank.model");

const getAllBanks = async (req, res, next) => {
    try {
        const banks = await bankModel.find().populate(["currency"]);
        res.status(200).json(banks);
    } catch (err) {
        next(err);
    }
};

const getBank = async (req, res, next) => {
    try {
        const bank = await bankModel.findById(req.params.id).populate(["currency"]);
        res.status(200).json(bank);
    } catch (err) {
        next(err);
    }
};

const createBank = async (req, res, next) => {
    try {
        const bank = await bankModel.create(req.body);
        res.status(200).json(bank);
    } catch (err) {
        next(err);
    }
};

const updateBank = async (req, res, next) => {
    try {
        const bank = await bankModel.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json(bank);
    } catch (err) {
        next(err);
    }
};

const deleteBank = async (req, res, next) => {
    try {
        const bank = await bankModel.findByIdAndDelete(req.params.id);
        res.status(200).json(bank);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllBanks,
    getBank,
    createBank,
    updateBank,
    deleteBank
}