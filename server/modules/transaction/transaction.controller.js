const transactionModel = require("../../DB/transaction.model");
const accountModel = require("../../DB/account.model");
const HttpError = require("../../common/httpError");

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
        const {account_id, amount} = req.body;
        const newTransaction = await new transactionModel({transactionType: "paid", task:0, amount, account_id}).save();
        const thisAccount = await accountModel.findById({_id: account_id});
        const newBalance = parseFloat(thisAccount.balance) - parseFloat(newTransaction.amount);
        await accountModel.findByIdAndUpdate({_id: account_id}, {balance: newBalance});
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