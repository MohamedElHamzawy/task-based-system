const taskModel = require("../../DB/task.model");
const statusModel = require("../../DB/status.model");
const HttpError = require("../../common/httpError");

const userA_status = ["created"];
const userB_status = ["processing"];

const getMyTasks = async (req,res,next) => {
    const role = req.user.userRole;
    const statusIDA = await statusModel.find({slug : {$in : userA_status}}).select("_id");
    const statusIDB = await statusModel.find({slug : {$in : userB_status}}).select("_id");
    if (role == "userA") {
        const tasks = await taskModel.find({taskstatus : {$in : [statusIDA]}});
        res.json({tasks: tasks});
    } else if (role == "userB") {
        const tasks = await taskModel.find({taskstatus : {$in : [statusIDB]}, speciality: req.user.speciality});
        res.json({tasks: tasks});
    } else if (role == "admin") {
        const tasks = await taskModel.find({});
        res.json({tasks: tasks});
    } else {
        res.json({tasks: []});
    }
}

const getTask = async (req,res,next) => {
    const role = req.user.userRole;
    const taskID = req.params.id;
    const thisTask = await taskModel.findOne({_id: taskID}).populate("client_id", "freelancer", "speciality", "taskstatus", "created_by", "accepted_by", "task_currency", "demand_currency", "paid_currency", "cost_currency", "profit_currency");
    if (thisTask) {
        const thisTaskStatus = statusModel.findOne({_id: thisTask.taskstatus}).select("slug");
        if (role == "admin") {
            res.json({task: thisTask});
        } else if (role == "userA" && userA_status.includes(thisTaskStatus)) {
            const thisTaskA = await taskModel.findOne({_id: taskID}).select("title channel client_id description speciality taskstatus deadline task_price task_currency cost_price cost_currency demand_price demand_currency paid_by_client paid_currency profit_percentage").populate("client_id", "speciality", "taskstatus", "cost_currency", "task_currency", "demand_currency");
            res.json({task: thisTaskA});
        } else if (role == "userB" && userB_status.includes(thisTaskStatus) && thisTask.accepted_by == req.user._id) {
            const thisTaskB = await taskModel.findOne({_id: taskID}).select("title channel description speciality taskstatus deadline freelancer demand_price demand_currency cost_price cost_currency task_price task_currency profit_percentage").populate("speciality", "taskstatus", "freelancer", "demand_currency", "cost_currency");
            res.json({task: thisTaskB, taskPrice: 20});
        } else {
            return next(new HttpError("You are not authorized to open this task!", 401));
        }
    } else {
        return next(new HttpError("This task doesn't exist on system!", 400));
    }
}

const createTask = async (req,res,next) => {
    const role = req.user.userRole;
    const statusID = await statusModel.find({slug: "created"}).select("_id");
    if (role == "admin" || role == "userA") {
        const {
            title,
            channel,
            client,
            description,
            speciality,
            deadline,
            percentage,
            taskPrice,
            taskCurrency
        } = req.body;
        const newTask = await new taskModel({
            title: title,
            channel: channel,
            client_id: client,
            description: description,
            speciality: speciality,
            taskstatus: statusID,
            deadline: deadline,
            created_by: req.user._id,
            profit_percentage: percentage,
            task_price: taskPrice,
            task_currency: taskCurrency
        }).save();
        res.json({message: "Task has been created successfully"});
    } else {
        return next(new HttpError("You are not authorized to create task!", 401));
    }
}

const acceptTask = async (req,res,next) => {
    const role = req.user.userRole;
    const taskID = req.params.id;
    const {
        freelancer,
        demandPrice,
        demandCurrency
    } = req.body;
    const statusID = await statusModel.find({slug: "accepted"}).select("_id");

    if (role == "admin" || role == "userB") {
        const tryGetTask = await taskModel.findOne({_id: taskID});
        if (tryGetTask) {
            const newTask = await taskModel.findByIdAndUpdate({_id: taskID}, {freelancer: freelancer, taskstatus: statusID, accepted_by: req.user._id, demand_price: demandPrice, demand_currency: demandCurrency});
        } else {
            return next(new HttpError("This task doesn't exist on system!", 400));
        }
    } else {
        return next(new HttpError("You are not authorized to accept task!", 401));
    }
}

const confirmTask = async (req,res,next) => {
    const role = req.user.userRole;
    const taskID = req.params.id;
    const {costPrice, costCurrency} = req.body;
    const statusID = await statusModel.find({slug: "confirmed"}).select("_id");

    if (role == "admin" || role == "userA") {
        await taskModel.findByIdAndUpdate({_id: taskID}, {taskstatus: statusID, cost_price: costPrice, cost_currency: costCurrency});
        res.json({message: "Task has been confirmed successfully"});
    } else {
        return next(new HttpError("You are not authorized to confirm task!", 401));
    }
}

const progressTask = async (req,res,next) => {
    const role = req.user.userRole;
    const taskID = req.params.id;
    const statusID = await statusModel.find({slug: "progress"}).select("_id");

    if (role == "admin", role == "userB") {
        await taskModel.findByIdAndUpdate({_id: taskID}, {taskstatus: statusID});
        res.json({message: "Task is in progress"});s
    } else {
        return next(new HttpError("You are not authorized to do this action", 401));
    }
}

const completeTask = async (req,res,next) => {
    const role = req.user.userRole;
    const taskID = req.params.id;
    const statusID = await statusModel.find({slug: "completed"}).select("_id");

    if (role == "admin", role == "userB") {
        await taskModel.findByIdAndUpdate({_id: taskID}, {taskstatus: statusID});
        res.json({message: "Task is in progress"});s
    } else {
        return next(new HttpError("You are not authorized to do this action", 401));
    }
}

const deliverTask = async (req,res,next) => {
    const role = req.user.userRole;
    const taskID = req.params.id;
    const statusID = await statusModel.find({slug: "delivered"}).select("_id");
    const {paidPrice, paidCurrency} = req.body;

    if (role != "userB") {
        await taskModel.findByIdAndUpdate({_id: taskID}, {taskstatus: statusID, paid_by_client: paidPrice, paid_currency: paidCurrency});
        res.json({message: "Task has been delivered successfully"});
    } else {
        return next(new HttpError("You are not authorized to deliver task", 401));
    }
}

const updateTask = async (req,res,next) => {
    const role = req.user.userRole;
    const taskID = req.params.id;
    const {
        title,
        channel,
        client_id,
        freelancer,
        description,
        speciality,
        taskstatus,
        deadline,
        created_by,
        accepted_by,
        task_price,
        task_currency,
        demand_price,
        demand_currency,
        paid_by_client,
        paid_currency,
        cost_price,
        cost_currency,
        profit_percentage,
        profit_amount,
        profit_currency
    } = req.body;
    const thisTask = await taskModel.findOne({_id: taskID});
    if (thisTask && role == "admin") {
        await taskModel.findByIdAndUpdate({_id: taskID}, {
            title,
            channel,
            client_id,
            freelancer,
            description,
            speciality,
            taskstatus,
            deadline,
            created_by,
            accepted_by,
            task_price,
            task_currency,
            demand_price,
            demand_currency,
            paid_by_client,
            paid_currency,
            cost_price,
            cost_currency,
            profit_percentage,
            profit_amount,
            profit_currency
        });
        res.json({message: "Task has been updated successfully"});
    } else {
        return next(new HttpError("Task doesn't exist on system or you are not authorized", 400));
    }
}

const deleteTask = async (req,res,next) => {
    const role = req.user.userRole;
    const taskID = req.params.id;

    const thisTask = await taskModel.findOne({_id: taskID});
    if (thisTask && role == "admin") {
        await taskModel.findByIdAndDelete({_id: taskID});
        res.json({message: "Task has been deleted successfully"});
    } else {
        return next(new HttpError("Task doesn't exist on system or you are not authorized", 400));
    }
}

module.exports = {getMyTasks, getTask, createTask, acceptTask, confirmTask, progressTask, completeTask, deliverTask, updateTask, deleteTask}