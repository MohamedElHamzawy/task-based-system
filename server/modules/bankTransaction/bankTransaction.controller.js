const bankModel = require("../../DB/bank.model");
const bankTransactionModel = require("../../DB/bank.transactions.model");

const getAllBankTransactions = async (req, res) => {
    try {
        const bankTransactions = await bankTransactionModel.find({$or: [{from: req.params.id}, {to: req.params.id}]}).populate(["from", "to"]);
        res.status(200).json(bankTransactions);
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
};

const getBankTransaction = async (req, res) => {
    try {
        const bankTransaction = await bankTransactionModel.findById(req.params.id);
        res.send(bankTransaction);
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
};

const createBankTransaction = async (req, res) => {
    try {
        const bankTransaction = new bankTransactionModel(req.body);
        await bankTransaction.save();
        await bankModel.findByIdAndUpdate(
            bankTransaction.from,
            { $inc: { balance: -bankTransaction.amount } } //This line is decreasing the balance of the bank that the transaction is from by the amount of the transaction.
        );
        await bankModel.findByIdAndUpdate(
            bankTransaction.to,
            { $inc: { balance: (bankTransaction.amount * bankTransaction.exchangeRate) } } //This line is increasing the balance of the bank that the transaction is to by the amount of the transaction.
        );
        res.status(200).json(bankTransaction);
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
};

const updateBankTransaction = async (req, res) => {
    try {
        const bankTransaction = await bankTransactionModel.findByIdAndUpdate(
            req.params.id,
            req.body
        );
        res.send(bankTransaction);
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
};

const deleteBankTransaction = async (req, res) => {
    try {
        const bankTransaction = await bankTransactionModel.findById(req.params.id);
        await bankModel.findByIdAndUpdate(
            bankTransaction.from,
            { $inc: { balance: bankTransaction.amount } } //This line is increasing the balance of the bank that the transaction is from by the amount of the transaction.
        );
        await bankModel.findByIdAndUpdate(
            bankTransaction.to,
            { $inc: { balance: -(bankTransaction.amount * bankTransaction.exchangeRate) } } //This line is decreasing the balance of the bank that the transaction is to by the amount of the transaction.
        );
        await bankTransactionModel.findByIdAndDelete(
            req.params.id
        );
        res.send(bankTransaction);
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
};
module.exports = {
    getAllBankTransactions,
    getBankTransaction,
    createBankTransaction,
    updateBankTransaction,
    deleteBankTransaction
};