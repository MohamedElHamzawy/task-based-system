const taskModel = require("../../DB/task.model");
const statusModel = require("../../DB/status.model");
const currencyModel = require("../../DB/currency.model");
const accountModel = require("../../DB/account.model");
const transactionModel = require("../../DB/transaction.model");
const HttpError = require("../../common/httpError");

const getMyTasks = async (req,res,next) => {
    const mainStatuses = await statusModel.find({changable: false}).select("_id");
    const role = req.user.userRole;
    if (role == "admin") {
        const tasks = await taskModel.find({});
        res.json({tasks: tasks});
    } else if (role == "userA") {
        const tasks = await taskModel.find({$and: [{created_by: req.user._id}, {taskStatus: {$in: mainStatuses}}]});
        res.json({tasks: tasks});
    } else if (role == "userB") {
        const tasks = await taskModel.find({$and: [{$or: [{accepted_by: req.user._id}, {accepted: false}]}, {taskStatus: {$in: mainStatuses}}]});
        res.json({tasks: tasks});
    } else {
        return next(new HttpError("You are not authorized to show tasks!", 401));
    }
}

const getTask = async (req,res,next) => {
    const role = req.user.userRole;
    const taskID = req.params.id;
    if (role == "admin") {
        const task = await taskModel
        .findOne({_id: taskID})
        .populate(["client", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency"]);
        res.json({task: task});
    } else if (role == "userA") {
        const task = await taskModel
        .findOne({$and: [{_id: taskID}, {created_by: req.user._id}, {taskStatus: {$in: mainStatuses}}]})
        .select("title description channel client speciality taskStatus deadline task_currency paid cost profit_percentage")
        .populate(["client", "speciality", "taskStatus", "task_currency"]);
        const currencyValue = parseFloat(await currencyModel.findOne({_id: task.task_currency}).select("priceToEGP"));
        const cost = parseFloat(task.cost);
        const profitPercentage = parseFloat(task.profit_percentage);
        const offer = ((cost + (cost * (profitPercentage/100))) / currencyValue);
        res.json({task: task, offer: offer});
    } else if (role == "userB") {
        const task = await taskModel
        .findOne({$and: [{_id: taskID}, {$or: [{accepted_by: req.user._id}, {accepted: false}]}, {taskStatus: {$in: mainStatuses}}]})
        .select("title description channel freelancer speciality taskStatus deadline cost")
        .populate(["speciality", "taskStatus", "freelancer"]);
        res.json({task: task});
    } else {
        return next(new HttpError("You are not authorized to show this task!", 401));
    }
}

const createTask = async (req,res,next) => {
    const role = req.user.userRole;
    if (role == "admin") {
        const {
            title,
            description,
            channel,
            client,
            speciality,
            deadline,
            task_currency,
            paid,
            profit_percentage
        } = req.body;
        const statusID = await statusModel.findOne({slug: "pending"}).select("_id");
        const newTask = await new taskModel({
            title,
            description,
            channel,
            client,
            speciality,
            deadline,
            task_currency,
            paid,
            profit_percentage,
            created_by: req.user._id,
            taskStatus: statusID
        }).save();
        res.json({message: "Task has been created successfully"});
    } else if (role == "userA") {
        const {
            title,
            description,
            channel,
            client,
            speciality,
            deadline,
            task_currency,
            paid
        } = req.body;
        const statusID = await statusModel.findOne({slug: "pending"}).select("_id");
        const newTask = await new taskModel({
            title,
            description,
            channel,
            client,
            speciality,
            deadline,
            task_currency,
            paid,
            created_by: req.user._id,
            taskStatus: statusID
        }).save();
        res.json({message: "Task has been created successfully"});
    } else {
        return next(new HttpError("You are not authorized to create task!", 401));
    }
}

const addOffer = async (req,res,next) => {
    const role = req.user.userRole;
    const taskID = req.params.id;
    const {freelancer, cost} = req.body;
    const statusID = await statusModel.findOne({slug: "admin-review"}).select("_id");
    if (role != "userA") {
        await taskModel.findByIdAndUpdate({_id: taskID}, {cost: cost, freelancer: freelancer, accepted_by: req.user._id, accepted: true, taskStatus: statusID});
        res.json({message: "Your offer has been added successfully"});
    } else {
        return next(new HttpError("You are not authorized to add freelancer offer to task!", 401));
    }
}

const addPercentage = async (req,res,next) => {
    const role = req.user.userRole;
    const taskID = req.params.id;
    const {percentage} = req.body;
    const statusID = await statusModel.findOne({slug: "in-negotiation"}).select("_id");
    if (role == "admin") {
        await taskModel.findByIdAndUpdate({_id: taskID}, {profit_percentage: percentage, taskStatus: statusID});
        res.json({message: "Your offer has been added successfully"});
    } else {
        return next(new HttpError("You are not authorized to add percentage to task!", 401));
    }
}

const confirmTask = async (req,res,next) => {
    const role = req.user.userRole;
    const taskID = req.params.id;
    const statusID = await statusModel.findOne({slug: "in-progress"}).select("_id");
    if (role != "userB") {
        await taskModel.findByIdAndUpdate({_id: taskID}, {taskStatus: statusID});
        const thisTask = await taskModel.findById({_id: taskID});
        const freelancerAccount = await accountModel.findOne({owner: thisTask.freelancer});
        const transactionF = await new transactionModel({transactiontype: "cost", task: taskID, amount: thisTask.cost, account_id: freelancerAccount._id}).save();
        const newBalanceF = parseFloat(freelancerAccount.balance) + parseFloat(transactionF.amount);
        await accountModel.findByIdAndUpdate({_id: freelancerAccount._id}, {balance: newBalanceF});
        const clientAccount = await accountModel.findOne({owner: thisTask.client});
        const transactionC = await new transactionModel({transactiontype: "paid", task: taskID, amount: thisTask.paid, account_id: clientAccount._id}).save();
        const newBalanceC = parseFloat(clientAccount.balance) - parseFloat(transactionC.amount);
        await accountModel.findByIdAndUpdate({_id: clientAccount._id}, {balance: newBalanceC});
        res.json({message: "Task has been confirmed successfully"});
    } else {
        return next(new HttpError("You are not authorized to confirm this task!", 401));
    }
}

const refuseTask = async (req,res,next) => {
    const role = req.user.userRole;
    const taskID = req.params.id;
    const statusID = await statusModel.findOne({slug: "pending"}).select("_id");
    if (role != "userB") {
        await taskModel.findByIdAndUpdate({_id: taskID}, {taskStatus: statusID, profit_percentage: 0, cost: 0, freelancer: 0, accepted_by: 0, accepted: false});
        res.json({message: "Task has been confirmed successfully"});
    } else {
        return next(new HttpError("You are not authorized to refuse this task!", 401));
    }
}

const completeTask = async (req,res,next) => {
    const role = req.user.userRole;
    const taskID = req.params.id;
    const statusID = await statusModel.findOne({slug: "completed"}).select("_id");
    if (role != "userA") {
        await taskModel.findByIdAndUpdate({_id: taskID}, {taskStatus: statusID});
        res.json({message: "Task has been completed successfully"});
    } else {
        return next(new HttpError("You are not authorized to complete this task!", 401));
    }
}

const deliverTask = async (req,res,next) => {
    const role = req.user.userRole;
    const taskID = req.params.id;
    const statusID = await statusModel.findOne({slug: "delivered-to-client"}).select("_id");
    if (role != "userA") {
        const thisTask = await taskModel.findOne({_id: taskID});
        const currencyValue = parseFloat(await currencyModel.findOne({_id: thisTask.task_currency}).select("priceToEGP"));
        const profit_amount = parseFloat(parseFloat(parseFloat(thisTask.paid) * currencyValue) - parseFloat(thisTask.cost));
        await taskModel.findByIdAndUpdate({_id: taskID}, {taskStatus: statusID, profit_amount: profit_amount});
        res.json({message: "Task has been completed successfully"});
    } else {
        return next(new HttpError("You are not authorized to complete this task!", 401));
    }
}

const updateTask = async (req,res,next) => {
    const role = req.user.userRole;
    const taskID = req.params.id;
    const {
        title,
        description,
        channel,
        client,
        freelancer,
        speciality,
        taskStatus,
        deadline,
        created_by,
        accepted_by,
        accepted,
        task_currency,
        client_offer,
        paid,
        cost,
        profit_percentage,
        profit_amount
    } = req.body;
    if (role == "admin") {
        await taskModel.findByIdAndUpdate({_id: taskID}, {
            title,
            description,
            channel,
            client,
            freelancer,
            speciality,
            taskStatus,
            deadline,
            created_by,
            accepted_by,
            accepted,
            task_currency,
            client_offer,
            paid,
            cost,
            profit_percentage,
            profit_amount
        });
        res.json({message: "Task has been updated successfully"});
    } else {
        return next(new HttpError("You are not authorized to full update this task!", 401));
    }
}

const deleteTask = async (req,res,next) => {
    const role = req.user.userRole;
    const taskID = req.params.id;
    if (role == "admin") {
        await taskModel.findByIdAndDelete({_id: taskID});
        res.json({message: "Task Has been deleted successfully"});
    } else {
        return next(new HttpError("You are not authorized to delete this task!", 401));
    }
}

module.exports = {getMyTasks, getTask, createTask, addOffer, addPercentage, refuseTask, confirmTask, completeTask, deliverTask, updateTask, deleteTask}