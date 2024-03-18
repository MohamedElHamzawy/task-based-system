const accountModel = require("../../../../DB/account.model");
const clientModel = require("../../../../DB/client.model");
const currencyModel = require("../../../../DB/currency.model");
const freelancerModel = require("../../../../DB/freelancer.model");
const statusModel = require("../../../../DB/status.model");
const taskModel = require("../../../../DB/task.model");
const transactionModel = require("../../../../DB/transaction.model");
const userModel = require("../../../../DB/user.model");

const cancelTask = async (req, res, next) => {
    try {
        const taskID = req.params.id;
        if (req.user.user_role != "admin") {
            return next(new HttpError("You are not authorized to add offer to this task!", 401));
        }
        const thisTask = await taskModel.findOne({_id: taskID});
        const currencyValue = await currencyModel.findOne({_id: thisTask.task_currency}).select("priceToEGP");
        const deliveredStatus = await statusModel.findOne({slug: "delivered"});
        if (thisTask.taskStatus == deliveredStatus._id) {
            const taskTransactions = await transactionModel.find({task: taskID});
            if (taskTransactions) {
                for (let i = 0; i < taskTransactions.length; i++) {
                    await accountModel.findByIdAndUpdate(
                        { _id: taskTransactions[i].account_id },
                        { $inc: { balance: -taskTransactions[i].amount } }
                    );
                    await transactionModel.findOneAndDelete({task: taskID, account_id: taskTransactions[i].account_id});
                }
            }

            await userModel.updateOne(
                { _id: thisTask.created_by },
                { $inc: { completedCount: -1, totalGain: -thisTask.paid * currencyValue.priceToEGP, totalProfit: -thisTask.profit_amount } }
            );
            await userModel.updateOne(
                { _id: thisTask.accepted_by },
                { $inc: { completedCount: -1, totalGain: -thisTask.paid * currencyValue.priceToEGP, totalProfit: -thisTask.profit_amount } }
            );
            await clientModel.updateOne(
                { _id: thisTask.client },
                { $inc: { completedCount: -1, totalGain: -thisTask.paid, totalProfit: -thisTask.profit_amount } }
            );
            await freelancerModel.updateOne(
                { _id: thisTask.freelancer },
                { $inc: { completedCount: -1, totalGain: -thisTask.cost, totalProfit: -thisTask.profit_amount } }
            );   
        }
        const statusID = await statusModel.findOne({slug: "cancelled"});
        await taskModel.findOneAndUpdate({_id: taskID}, {taskStatus: statusID._id, profit_amount: 0}, {new: true});
        await noteModel.create({task_id: taskID, content: `Task cancelled by ${req.user.full_name}`, user_id: req.user._id});
        res.json({message: "Task has been cancelled!"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = cancelTask