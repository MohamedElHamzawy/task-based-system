const taskModel = require("../../DB/task.model");
const statusModel = require("../../DB/status.model");
const currencyModel = require("../../DB/currency.model");
const noteModel = require("../../DB/note.model");
const HttpError = require("../../common/httpError");
const commentModel = require("../../DB/comment.model");
const profitModel = require("../../DB/profit.model");
const userModel = require("../../DB/user.model");
const clientModel = require("../../DB/client.model");

const {acceptTask, confirmTaskB, makeOffer, confirmTaskA, refuseTask, deliverTask} = require("./task.functions");

const getMyTasks = async (req,res,next) => {
    try {
        const role = req.user.user_role;
        if (role == "admin") {
            const tasks = await taskModel.find({}).populate(["client", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency"]);
            const tasksCount = tasks.length;
            let totalCost = 0;
            let totalGain = 0;
            let totalProfit = 0;
            tasks.forEach(task => {
                totalCost += task.cost;
                totalGain += (task.paid * task.task_currency.priceToEGP);
                totalProfit += task.profit_amount;
            });
            const totalProfitPercentage = totalProfit/totalGain*100;
            res.json({tasks: tasks, tasksCount: tasksCount, totalCost: totalCost, totalGain: totalGain, totalProfit: totalProfit, totalProfitPercentage: totalProfitPercentage.toFixed(2)});
        } else if (role == "customerService") {
            const tasks = await taskModel.find({created_by: req.user._id}).populate(["client", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency"]);
            res.json({tasks: tasks});
        } else if (role == "specialistService") {
            const pendingTasks = await taskModel.find({$and: [{accepted: false}, {speciality: req.user.speciality}]}).populate(["client", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency"]);
            const myTasks = await taskModel.find({$and: [{accepted_by: req.user._id}]}).populate(["client", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency"]);
            res.json({myTasks: myTasks, pendingTasks: pendingTasks});
        } else {
            return next(new HttpError("You are not authorized to show tasks!", 401));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const dateFilterTasks = async (req,res,next) => {
    try {
        const {start, end} = req.body;
        const tasks = await taskModel.find({}).gte('createdAt', start).lte('createdAt', end).populate(["client", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency"]);
        const tasksCount = tasks.length;
        let totalCost = 0;
        let totalGain = 0;
        let totalProfit = 0;
        tasks.forEach(task => {
            totalCost += task.cost;
            totalGain += (task.paid * task.task_currency.priceToEGP);
            totalProfit += task.profit_amount;
        });
        const totalProfitPercentage = totalProfit/totalGain*100;
        res.json({tasks: tasks, tasksCount: tasksCount, totalCost: totalCost, totalGain: totalGain, totalProfit: totalProfit, totalProfitPercentage: totalProfitPercentage});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const getTask = async (req,res,next) => {
    try {
        const role = req.user.user_role;
        const taskID = req.params.id;
        const mainStatuses = await statusModel.find({changable: false}).select("_id");
        const getProfit = await profitModel.find({});

        const profitMinPercentage = getProfit[0].minimum;
        const profitMaxPercentage = getProfit[0].maximum;
        if (role == "admin") {
            const task = await taskModel
            .findOne({_id: taskID})
            .populate(["client", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency"]);
            const currencyValue = await currencyModel.findOne({_id: task.task_currency}).select("priceToEGP");
            const specialistOfferMax = (task.cost + (task.cost * profitMaxPercentage/100)) / currencyValue.priceToEGP;
            const specialistOfferMin = (task.cost + (task.cost * profitMinPercentage/100)) / currencyValue.priceToEGP;
            const customerOfferMax = (task.paid - (task.paid * profitMinPercentage/100)) * currencyValue.priceToEGP;
            const customerOfferMin = (task.paid - (task.paid * profitMaxPercentage/100)) * currencyValue.priceToEGP;
            const offer = {
                specialistOfferMin,
                specialistOfferMax,
                customerOfferMin,
                customerOfferMax
            };
            const notes = await noteModel.find({task_id: taskID}).populate(["user_id", "task_id"]);
            const comments = await commentModel.find({task_id: taskID}).populate(["user_id"]);
            res.json({task: task, comments: comments, notes: notes, offer: offer});
        } else if (role == "customerService") {
            const task = await taskModel
            .findOne({$and: [{_id: taskID}, {created_by: req.user._id}, {taskStatus: {$in: mainStatuses}}]})
            .select("_id title description channel client speciality taskStatus deadline task_currency paid cost")
            .populate(["client", "speciality", "taskStatus", "task_currency"]);
            const currencyValue = await currencyModel.findOne({_id: task.task_currency}).select("priceToEGP");
            const specialistOfferMin = (task.cost + (task.cost * profitMinPercentage/100)) / currencyValue.priceToEGP;
            const specialistOfferMax = (task.cost + (task.cost * profitMaxPercentage/100)) / currencyValue.priceToEGP;
            const offer = {
                specialistOfferMin,
                specialistOfferMax
            };
            const comments = await commentModel.find({task_id: taskID}).populate(["user_id"]);
            res.json({task: task, comments: comments, offer: offer});
        } else if (role == "specialistService") {
            const task = await taskModel
            .findOne({$and: [{_id: taskID}, {$or: [{accepted_by: req.user._id}, {accepted: false}]}, {taskStatus: {$in: mainStatuses}}]})
            .select("_id title description channel freelancer paid task_currency speciality taskStatus deadline cost")
            .populate(["speciality", "taskStatus", "freelancer"]);
            const currencyValue = await currencyModel.findOne({_id: task.task_currency}).select("priceToEGP");
            const customerOfferMax = (task.paid - (task.paid * profitMinPercentage/100)) * currencyValue.priceToEGP;
            const customerOfferMin = (task.paid - (task.paid * profitMaxPercentage/100)) * currencyValue.priceToEGP;
            const offer = {
                customerOfferMin,
                customerOfferMax
            };
            const comments = await commentModel.find({task_id: taskID}).populate(["user_id"]);
            res.json({task: task, comments: comments, offer: offer});
        } else {
            return next(new HttpError("You are not authorized to show this task!", 401));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const createTask = async (req,res,next) => {
    try {
        const role = req.user.user_role;
        if (role != "specialistService") {
            const {
                title,
                description,
                channel,
                client,
                speciality,
                deadline,
                task_currency,
                paid,
                status
            } = req.body;
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
                taskStatus: status
            }).save();
            const date = new Date();
            await new noteModel({content: `Task has been created by ${req.user.fullname} in ${date}`, user_id: req.user._id, task_id: newTask._id}).save();
            const userA = await userModel.findById({_id: newTask.created_by});
            const newuserATasksCount = userA.tasksCount + 1; 
            await userModel.findByIdAndUpdate({_id: req.user._id}, {tasksCount: newuserATasksCount});
            const thisClient = await clientModel.findById({_id: newTask.client});
            const newClientTasksCount = thisClient.tasksCount + 1;
            await clientModel.findByIdAndUpdate({_id: client}, {tasksCount: newClientTasksCount});
            res.json({message: "Task has been created successfully"});
        } else {
            return next(new HttpError("You are not authorized to create task!", 401));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const partialUpdateTask = async (req,res,next) => {
    try {
        const role = req.user.user_role;
        const taskID = req.params.id;
        const {statusID} = req.body;
        const currentStatus = await statusModel.findById({_id: statusID});
        if (currentStatus.slug == "working-on" && role != "customerService") {
            const msg = await acceptTask(taskID, req.user.fullname, req.user._id);
            await taskModel.findByIdAndUpdate({_id: taskID}, {taskStatus: statusID});
            res.json({msg});
        } else if (currentStatus.slug == "waiting-offer" && role != "customerService") {
            await taskModel.findByIdAndUpdate({_id: taskID}, {taskStatus: statusID});
            const date = new Date();
            await new noteModel({content: `${req.user.fullname} has set task to be waiting offer in ${date}`, user_id: req.user._id, task_id: taskID}).save();
            res.json({msg:"Task set to waiting offer successfully"});
        } else if (currentStatus.slug == "not-available" && role != "customerService") {
            await taskModel.findByIdAndUpdate({_id: taskID}, {taskStatus: statusID});
            const date = new Date();
            await new noteModel({content: `${req.user.fullname} has set task to be unavailable in ${date}`, user_id: req.user._id, task_id: taskID}).save();
            res.json({msg:"Task set to not available successfully"});
        } else if (currentStatus.slug == "on-going" && role != "customerService") {
            const {freelancerID, cost} = req.body;
            const msg = await confirmTaskB(taskID, freelancerID, cost, req.user.fullname, req.user._id);
            await taskModel.findByIdAndUpdate({_id: taskID}, {taskStatus: statusID});
            res.json({msg});
        } else if (currentStatus.slug == "done" && role != "customerService") {
            await taskModel.findByIdAndUpdate({_id: taskID}, {taskStatus: statusID});
            const date = new Date();
            await new noteModel({content: `${req.user.fullname} has set task to be done in ${date}`, user_id: req.user._id, task_id: taskID}).save();
            res.json({msg:"Task set to done successfully"});
        } else if (currentStatus.slug == "delivered" && role != "specialistService") {
            const msg = await deliverTask(taskID, req.user.fullname, req.user._id);
            await taskModel.findByIdAndUpdate({_id: taskID}, {taskStatus: statusID});
            res.json({msg});
        } else if (currentStatus.slug == "offer-submitted" && role != "customerService") {
            const {freelancerID, cost} = req.body;
            await acceptTask(taskID, req.user.fullname, req.user._id);
            const msg = await makeOffer(taskID, freelancerID, cost, req.user.fullname, req.user._id);
            await taskModel.findByIdAndUpdate({_id: taskID}, {taskStatus: statusID});
            res.json({msg});
        } else if (currentStatus.slug == "pending" && role != "specialistService") {
            await taskModel.findByIdAndUpdate({_id: taskID}, {taskStatus: statusID});
            const date = new Date();
            await new noteModel({content: `${req.user.fullname} has set task to be pending in ${date}`, user_id: req.user._id, task_id: taskID}).save();
            res.json({msg:"Task set to pending successfully"});
        } else if (currentStatus.slug == "approved" && role != "specialistService") {
            const {paid} = req.body;
            const msg = await confirmTaskA(taskID, paid, req.user._id, req.user.fullname);
            await taskModel.findByIdAndUpdate({_id: taskID}, {taskStatus: statusID});
            res.json({msg});
        } else if (currentStatus.slug == "rejected" && role != "specialistService") {
            const msg = await refuseTask(taskID, req.user.fullname, req.user._id);
            await taskModel.findByIdAndUpdate({_id: taskID}, {taskStatus: statusID});
            res.json({msg});
        } else if (currentStatus.slug == "cancel") {
            await taskModel.findByIdAndUpdate({_id: taskID}, {taskStatus: statusID});
            const date = new Date();
            await new noteModel({content: `${req.user.fullname} has set task to be cancelled in ${date}`, user_id: req.user._id, task_id: taskID}).save();
            res.json({msg:"Task set to cancelled successfully"});
        } else if (currentStatus.slug == "edit") {
            await taskModel.findByIdAndUpdate({_id: taskID}, {taskStatus: statusID});
            const date = new Date();
            await new noteModel({content: `${req.user.fullname} has set task to need edit in ${date}`, user_id: req.user._id, task_id: taskID}).save();
            res.json({msg:"Task set to edit successfully"});
        } else {
            return next(new HttpError("You are not authorized to make this edit", 401));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const updateTask = async (req,res,next) => {
    try {
        const role = req.user.user_role;
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
            const date = new Date();
            await new noteModel({content: `Admin: ${req.user.fullname} has updated this task in ${date}`, user_id: req.user._id, task_id: taskID}).save();
            res.json({message: "Task has been updated successfully"});
        } else {
            return next(new HttpError("You are not authorized to full update this task!", 401));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const deleteTask = async (req,res,next) => {
    try {
        const role = req.user.user_role;
        const taskID = req.params.id;
        if (role != "specialistService") {
            await taskModel.findByIdAndDelete({_id: taskID});
            res.json({message: "Task Has been deleted successfully"});
        } else {
            return next(new HttpError("You are not authorized to delete this task!", 401));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = {getMyTasks, getTask, dateFilterTasks, createTask, partialUpdateTask, updateTask, deleteTask}