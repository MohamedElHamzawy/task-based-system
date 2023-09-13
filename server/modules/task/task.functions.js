const taskModel = require("../../DB/task.model");
const currencyModel = require("../../DB/currency.model");
const accountModel = require("../../DB/account.model");
const transactionModel = require("../../DB/transaction.model");
const noteModel = require("../../DB/note.model");
const userModel = require("../../DB/user.model");
const freelancerModel = require("../../DB/freelancer.model");
const clientModel = require("../../DB/client.model");


const acceptTask = async (taskID,userName,userID) => {
    await taskModel.findByIdAndUpdate({_id: taskID}, {accepted_by: userID, accepted: true});
    const thisTask = await taskModel.findOne({_id: taskID});
    const userB = await userModel.findById({_id: thisTask.accepted_by});
    const newuserBTasksCount = userB.tasksCount + 1;
    await userModel.findByIdAndUpdate({_id: userID}, {tasksCount: newuserBTasksCount});
    
    const date = new Date();
    await new noteModel({content: `${userName} has received task in ${date} and now working on it`, user_id: userID, task_id: taskID}).save();
    return "Task has been accepted successfully";
}

const confirmTaskB = async (taskID, freelancerID, cost, userName, userID) => {
    await taskModel.findByIdAndUpdate({_id: taskID}, {freelancer: freelancerID, cost: cost});
    const thisTask = await taskModel.findOne({_id: taskID});
    const freelancer = await freelancerModel.findById({_id: thisTask.freelancer});
    const newfreelancerTasksCount = freelancer.tasksCount + 1;
    await freelancerModel.findByIdAndUpdate({_id: freelancerID}, {tasksCount: newfreelancerTasksCount});

    const date = new Date();
    await new noteModel({content: `Task has been confirmed by ${userName} in ${date}`, user_id: userID, task_id: taskID}).save();
    return "Task has been confirmed successfully";
}

const makeOffer = async (taskID, freelancerID, cost, userName, userID) => {
    await taskModel.findByIdAndUpdate({_id: taskID}, {freelancer: freelancerID, cost: cost});
    const thisTask = await taskModel.findOne({_id: taskID});
    const freelancer = await freelancerModel.findById({_id: thisTask.freelancer});
    const newfreelancerTasksCount = freelancer.tasksCount + 1;
    await freelancerModel.findByIdAndUpdate({_id: freelancerID}, {tasksCount: newfreelancerTasksCount});

    const date = new Date();
    await new noteModel({content: `${userName} has made an offer in ${date}`, user_id: userID, task_id: taskID}).save();
    return "Offer has been confirmed successfully";
}

const confirmTaskA = async (taskID, paid, userID, userName) => {
    await taskModel.findByIdAndUpdate({_id: taskID}, {paid: paid});

    const date = new Date();
    await new noteModel({content: `Task has been approved by ${userName} in ${date}`, user_id: userID, task_id: taskID}).save();
    return "Task has been approved successfully";
}

const refuseTask = async (taskID, userName, userID) => {
    await taskModel.findByIdAndUpdate({_id: taskID}, {cost: 0, freelancer: "0000000000000000000000ee", accepted_by: "0000000000000000000000ee", accepted: false});

    const date = new Date();
    await new noteModel({content: `Task's offer has been rejected by ${userName} in ${date}`, user_id: userID, task_id: taskID}).save();
    return "Offer has been rejected successfully";
}

const deliverTask = async (taskID,userName,userID) => {
    const thisTask = await taskModel.findOne({_id: taskID});

    const currencyValue = await currencyModel.findOne({_id: thisTask.task_currency}).select("priceToEGP");
    const freelancer = await freelancerModel.findById({_id: thisTask.freelancer});
    const client = await clientModel.findById({_id: thisTask.client});

    const freelancerAccount = await accountModel.findOne({owner: thisTask.freelancer});
    const transactF = thisTask.cost / freelancer.currency;
    const transactionF = await new transactionModel({transactiontype: "cost", task: taskID, amount: transactF, method: "system", account_id: freelancerAccount._id}).save();
    const newBalanceF = parseFloat(freelancerAccount.balance) + parseFloat(transactionF.amount);
    await accountModel.findByIdAndUpdate({_id: freelancerAccount._id}, {balance: newBalanceF});

    const clientAccount = await accountModel.findOne({owner: thisTask.client});
    const transactionC = await new transactionModel({transactiontype: "gain", task: taskID, amount: thisTask.paid, method: "system", account_id: clientAccount._id}).save();
    const newBalanceC = parseFloat(clientAccount.balance) + parseFloat(transactionC.amount);
    await accountModel.findByIdAndUpdate({_id: clientAccount._id}, {balance: newBalanceC});

    const profit_amount = (thisTask.paid * currencyValue.priceToEGP) - thisTask.cost;
    await taskModel.findByIdAndUpdate({_id: taskID}, {profit_amount: profit_amount});

    const newClientCompletedCount = client.completedCount + 1;
    const newClientTotalGain = client.totalGain + thisTask.paid;
    const newClientTotalProfit = client.totalProfit + profit_amount;
    await clientModel.findByIdAndUpdate({_id: thisTask.client}, {completedCount: newClientCompletedCount, totalGain: newClientTotalGain, totalProfit: newClientTotalProfit});

    const newfreelancerCompletedCount = freelancer.completedCount + 1;
    const newfreelancerTotalGain = freelancer.totalGain + (thisTask.paid * currencyValue.priceToEGP);
    const newfreelancerTotalProfit = freelancer.totalProfit + profit_amount;
    await freelancerModel.findByIdAndUpdate({_id: thisTask.freelancer}, {completedCount: newfreelancerCompletedCount, totalGain: newfreelancerTotalGain, totalProfit: newfreelancerTotalProfit});

    const userA = await userModel.findById({_id: thisTask.created_by});
    const newuserACompletedCount = userA.completedCount + 1;
    const newuserATotalGain = userA.totalGain + (thisTask.paid * currencyValue.priceToEGP);
    const newuserATotalProfit = userA.totalProfit + profit_amount;
    await userModel.findByIdAndUpdate({_id: thisTask.created_by}, {completedCount: newuserACompletedCount, totalGain: newuserATotalGain, totalProfit: newuserATotalProfit});
    
    const userB = await userModel.findById({_id: thisTask.accepted_by});
    const newuserBCompletedCount = userB.completedCount + 1;
    const newuserBTotalGain = userB.totalGain + (thisTask.paid * currencyValue.priceToEGP);
    const newuserBTotalProfit = userB.totalProfit + profit_amount;
    await userModel.findByIdAndUpdate({_id: thisTask.created_by}, {completedCount: newuserBCompletedCount, totalGain: newuserBTotalGain, totalProfit: newuserBTotalProfit});
    
    const date = new Date();
    await new noteModel({content: `Task has been delivered to client by ${userName} in ${date}`, user_id: userID, task_id: taskID}).save();
    return "Task has been completed successfully";
}

module.exports = {acceptTask, confirmTaskB, makeOffer, confirmTaskA, refuseTask, deliverTask}