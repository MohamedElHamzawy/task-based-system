const bankTransactionModel = require("./bank.transactions.model");

const getAllBankTransactions = async (req, res) => {
    const bankTransactions = await bankTransactionModel.find();
    res.send(bankTransactions);
};

const getBankTransaction = async (req, res) => {
    const bankTransaction = await bankTransactionModel.findById(req.params.id);
    res.send(bankTransaction);
};

const createBankTransaction = async (req, res) => {
    const bankTransaction = new bankTransactionModel(req.body);
    await bankTransaction.save();
    res.send(bankTransaction);
};

const updateBankTransaction = async (req, res) => {
    const bankTransaction = await bankTransactionModel.findByIdAndUpdate(
        req.params.id,
        req.body
    );
    res.send(bankTransaction);
};

const deleteBankTransaction = async (req, res) => {
    const bankTransaction = await bankTransactionModel.findByIdAndDelete(
        req.params.id
    );
    res.send(bankTransaction);
};
module.exports = {
    getAllBankTransactions,
    getBankTransaction,
    createBankTransaction,
    updateBankTransaction,
    deleteBankTransaction
};