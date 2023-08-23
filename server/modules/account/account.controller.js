const accountModel = require("../../DB/account.model");
const HttpError = require("../../common/httpError");

const getAllAccounts = async (req,res,next) => {
    const accounts = await accountModel.find({});
    res.json({accounts: accounts});
}

const getAccount = async (req,res,next) => {
    const accountID = req.params.id;
    const thisAccount = await accountModel.findById({_id: accountID});
    if (thisAccount) {
        res.json({account: thisAccount});
    } else {
        return next(new HttpError("This account doesn't exist on system", 400));
    }
}

const createAccount = async (req,res,next) => {
    const {title} = req.body;
    new accountModel({owner: "123", title: title}).save();
    res.json({message: "Account has been created successfully"});
}

const updateAccount = async (req,res,next) => {
    const {title} = req.body;
    const accountID = req.params.id;
    const tryGetThisAccount = await accountModel.findById({_id: accountID});
    if (tryGetThisAccount) {
        await accountModel.findByIdAndUpdate({_id: accountID}, {title: title});
        res.json({message: "Account has been updated successfully"});
    } else {
        return next(new HttpError("This Account doesn't exist on system", 400));
    }
}

const deleteAccount = async (req,res,next) => {
    const accountID = req.params.id;
    const tryGetThisAccount = await accountModel.findById({_id: accountID});
    if (tryGetThisAccount) {
        await accountModel.findByIdAndDelete({_id: accountID});
        res.json({message: "Account has been deleted successfully"});
    } else {
        return next(new HttpError("This Account doesn't exist on system", 400));
    }
}
module.exports = {getAllAccounts, getAccount, createAccount, updateAccount, deleteAccount}