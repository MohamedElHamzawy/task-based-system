const accountModel = require("../../DB/account.model");
const transactionModel = require("../../DB/transaction.model");
const HttpError = require("../../common/httpError");

const getAllAccounts = async (req,res,next) => {
    const accounts = await accountModel.find({}).populate("owner");
    res.json({accounts: accounts});
}

const getAccount = async (req,res,next) => {
    const accountID = req.params.id;
    const thisAccount = await accountModel.findById({_id: accountID}).populate("owner");
    if (thisAccount) {
        const transactions = await transactionModel.find({account_id: thisAccount._id}).populate(["task", "account_id"]);
        res.json({account: thisAccount, transactions: transactions});
    } else {
        return next(new HttpError("This account doesn't exist on system", 400));
    }
}

module.exports = {getAllAccounts, getAccount}