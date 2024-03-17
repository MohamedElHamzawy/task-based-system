const accountModel = require("../../../../DB/account.model");
const clientModel = require("../../../../DB/client.model");
const currencyModel = require("../../../../DB/currency.model");
const freelancerModel = require("../../../../DB/freelancer.model");
const statusModel = require("../../../../DB/status.model");
const taskModel = require("../../../../DB/task.model");
const transactionModel = require("../../../../DB/transaction.model");
const userModel = require("../../../../DB/user.model");
const HttpError = require("../../../../common/httpError");

const deliverTask = async (req, res, next) => {
    try {
        const taskID = req.params.id;
        const statusID = await statusModel.findOne({slug: "delivered"})._id;
        const [thisTask, freelancerAccount, freelancer, clientAccount, transactionC, transactionF, currencyValueF, currencyValue] = await Promise.all([
            taskModel.findOne({_id: taskID}).lean(),
            accountModel.findOne({owner: thisTask.freelancer}).lean(),
            freelancerModel.findById(thisTask.freelancer).lean(),
            accountModel.findOne({owner: thisTask.client}).lean(),
            new transactionModel({transactiontype: "gain", task: taskID, amount: thisTask.paid, method: "system", account_id: clientAccount._id}).save(),
            new transactionModel({transactiontype: "cost", task: taskID, amount: thisTask.cost / currencyValueF.priceToEGP, method: "system", account_id: freelancerAccount._id}).save(),
            currencyModel.findOne({_id: freelancer.currency}).select("priceToEGP").lean(),
            currencyModel.findOne({_id: thisTask.task_currency}).select("priceToEGP").lean()
        ]);
        const profit_amount = (thisTask.paid * currencyValue.priceToEGP) - thisTask.cost;
        await Promise.all([
            taskModel.findOneAndUpdate({_id: taskID}, {taskStatus: statusID, profit_amount: profit_amount}, {new: true}).lean(),
            accountModel.findByIdAndUpdate(freelancerAccount._id, {$inc: {balance: transactionF.amount}}).lean(),
            accountModel.findByIdAndUpdate(clientAccount._id, {$inc: {balance: transactionC.amount}}).lean(),
            clientModel.updateOne({_id: thisTask.client}, {$inc: {completedCount: 1, totalGain: thisTask.paid, totalProfit: profit_amount}}).lean(),
            freelancerModel.updateOne({_id: thisTask.freelancer}, {$inc: {completedCount: 1, totalGain: thisTask.cost, totalProfit: profit_amount}}).lean(),
            userModel.updateOne({_id: thisTask.accepted_by}, {$inc: {completedCount: 1, totalGain: thisTask.paid, totalProfit: profit_amount}}).lean(),
            userModel.updateOne({_id: thisTask.created_by}, {$inc: {completedCount: 1, totalGain: thisTask.paid, totalProfit: profit_amount}}).lean()
        ]);
        res.json({message: "Task has been delivered!"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = deliverTask