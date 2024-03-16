const bankModel = require("../../DB/bank.model");
const accountModel = require("../../DB/account.model");
const bankTransactionModel = require("../../DB/bank.transactions.model");
const HttpError = require("../../common/httpError");

const getAllBankTransactions = async (req, res, next) => {
  try {
    const bankTransactions = await bankTransactionModel.find({
      $or: [{ from: req.params.id }, { to: req.params.id }],
    });
    const transactionsPromises = bankTransactions.map(async (trans) => {
      let getFrom = await bankModel.findById(trans.from);
      if (!getFrom) {
        getFrom = await accountModel.findById(trans.from);
      }
      let getTo = await bankModel.findById(trans.to);
      if (!getTo) {
        getTo = await accountModel.findById(trans.to);
      }

      let finalAmount;
      if (trans.from == req.params.id) {
        finalAmount = trans.amount;
      }
      if (trans.to == req.params.id) {
        finalAmount = trans.amount * trans.exchangeRate;
      }
      let transaction = {
        _id: trans._id,
        from: getFrom,
        to: getTo,
        amount: finalAmount,
        exchangeRate: trans.exchangeRate,
        createdAt: trans.createdAt,
      };
      return transaction;
    });
    const transactions = await Promise.all(transactionsPromises);
    res.status(200).json(transactions);
  } catch (error) {
    return next(new HttpError(`Unexpected Error: ${error}`, 500));
  }
};

const getBankTransaction = async (req, res, next) => {
  try {
    const bankTransaction = await bankTransactionModel.findById(req.params.id);
    res.send(bankTransaction);
  } catch (error) {
    return next(new HttpError(`Unexpected Error: ${error}`, 500));
  }
};

const createBankTransaction = async (req, res, next) => {
  try {
    const bankTransaction = new bankTransactionModel(req.body);
    await bankTransaction.save();
    await bankModel.findByIdAndUpdate(
      bankTransaction.from,
      { $inc: { balance: -bankTransaction.amount } } //This line is decreasing the balance of the bank that the transaction is from by the amount of the transaction.
    );
    await bankModel.findByIdAndUpdate(
      bankTransaction.to,
      {
        $inc: {
          balance: bankTransaction.amount * bankTransaction.exchangeRate,
        },
      } //This line is increasing the balance of the bank that the transaction is to by the amount of the transaction.
    );
    res.status(200).json(bankTransaction);
  } catch (error) {
    return next(new HttpError(`Unexpected Error: ${error}`, 500));
  }
};

const updateBankTransaction = async (req, res, next) => {
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

const deleteBankTransaction = async (req, res, next) => {
  try {
    const bankTransaction = await bankTransactionModel.findById(req.params.id);
    await bankModel.findByIdAndUpdate(
      bankTransaction.from,
      { $inc: { balance: bankTransaction.amount } } //This line is increasing the balance of the bank that the transaction is from by the amount of the transaction.
    );
    await bankModel.findByIdAndUpdate(
      bankTransaction.to,
      {
        $inc: {
          balance: -(bankTransaction.amount * bankTransaction.exchangeRate),
        },
      } //This line is decreasing the balance of the bank that the transaction is to by the amount of the transaction.
    );
    await bankTransactionModel.findByIdAndDelete(req.params.id);
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
  deleteBankTransaction,
};
