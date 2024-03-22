const transactionModel = require("../../DB/transaction.model");
const accountModel = require("../../DB/account.model");
const clientModel = require("../../DB/client.model");
const HttpError = require("../../common/httpError");
const bankTransactionModel = require("../../DB/bank.transactions.model");
const bankModel = require("../../DB/bank.model");

const getAllTransactions = async (req,res,next) => {
    try {
        const transactions = await transactionModel.find({}).populate(["task", "account_id"]);
        res.json({transactions: transactions});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const getTransaction = async (req,res,next) => {
    try {
        const transactionID = req.params.id;
        const thisTransaction = await transactionModel.findOne({_id: transactionID}).populate(["task", "account_id"]);
        if (thisTransaction) {
            res.json({transaction: thisTransaction});
        } else {
            return next(new HttpError("This transaction doesn't exist on system", 400));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const createTransaction = async (req,res,next) => {
    try {
        const {account_id, bankAccountId, method, amount} = req.body;
        const bankAccount = await bankModel.findById({_id: bankAccountId});
        const newTransaction = await new transactionModel({transactionType: "paid", task:"000000000000", amount, method, accountNumber: bankAccount.title, account_id}).save();
        const thisAccount = await accountModel.findById({_id: account_id});
        const newBalance = parseFloat(thisAccount.balance) - parseFloat(newTransaction.amount);
        await accountModel.findByIdAndUpdate({_id: account_id}, {balance: newBalance});
        const client = await clientModel.findOne({_id: thisAccount.owner});
        if (client) {
            await new bankTransactionModel({from: account_id, to: bankAccountId, amount, exchangeRate: 1}).save();
            await bankModel.findByIdAndUpdate(bankAccountId,{ $inc: { balance: amount } });
        } else {
            await new bankTransactionModel({from: bankAccountId, to: account_id, amount, exchangeRate: 1}).save();
            await bankModel.findByIdAndUpdate(bankAccountId,{ $inc: { balance: -amount } });
        }
        res.json({message: "Transaction has been created successfully"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const deleteTransaction = async (req,res,next) => {
    try {
        const transactionID = req.params.id;
        const thisTransaction = await transactionModel.findOne({_id: transactionID});
        if (thisTransaction) {
            const thisAccount = await accountModel.findById({_id: thisTransaction.account_id});
            const newBalance = parseFloat(thisAccount.balance) + parseFloat(thisTransaction.amount);
            await accountModel.findByIdAndUpdate({_id: thisTransaction.account_id}, {balance: newBalance});
            await transactionModel.findByIdAndDelete({_id: transactionID});
            res.json({message: "Transaction has been deleted successfully"});
        } else {
            return next(new HttpError("This transaction doesn't exist on system", 400));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = {getAllTransactions, getTransaction, createTransaction, deleteTransaction}