const statusModel = require("../../../DB/status.model");
const taskModel = require("../../../DB/task.model");
const HttpError = require("../../../common/httpError");

const getMyTasks = async (req,res,next) => {
    try {
        const {page, limit} = req.query;
        const skip = (page - 1) * limit;
        const role = req.user.user_role;
        if (role == "admin") {
            const tasks = await taskModel.find({}).skip(skip).limit(limit).sort({updatedAt: -1}).populate(["client", "country", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency", "show_created", "show_accepted"]);
            const tasksCount = tasks.length;
            const completed = await statusModel.find({slug: "delivered"});
            const completedTasks = await taskModel.find({taskStatus: completed[0]._id});
            const completedCount = completedTasks.length;
            const totalCost = tasks.reduce((acc, task) => acc + (task.cost || 0), 0);
            const totalGain = tasks.reduce((acc, task) => acc + ((task.paid || 0) * (task.task_currency?.priceToEGP || 1)), 0);
            const totalProfit = tasks.reduce((acc, task) => acc + (task.profit_amount || 0), 0);
            const totalProfitPercentage = (totalProfit/totalGain)*100;
            res.json({tasks: tasks, tasksCount: tasksCount, completedCount: completedCount, totalCost: totalCost, totalGain: totalGain, totalProfit: totalProfit, totalProfitPercentage: totalProfitPercentage.toFixed(2)});
        } else if (role == "customerService") {
            const status1 = await statusModel.find({slug: "offer-submitted"});
            const status2 = await statusModel.find({slug: "on-going"});
            const status3 = await statusModel.find({slug: "done"});
            const pendingTasks = await taskModel.find({taskStatus: {$in: [status1[0]._id, status2[0]._id, status3[0]._id]}}).skip(skip).limit(limit).sort({updatedAt: -1}).populate(["client", "country", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency", "show_created", "show_accepted"]);
            const tasks = await taskModel.find().skip(skip).limit(limit).sort({updatedAt: -1}).populate(["client", "country", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency", "show_created", "show_accepted"]);
            res.json({tasks: tasks, pendingTasks: pendingTasks});
        } else if (role == "specialistService") {
            const status1 = await statusModel.find({slug: "waiting-offer"});
            const status2 = await statusModel.find({slug: "approved"});
            const status3 = await statusModel.find({slug: "edit"});
            const status4 = await statusModel.find({slug: "working-on"});
            const pendingTasks = await taskModel.find({taskStatus: {$in: [status1[0]._id, status2[0]._id, status3[0]._id, status4[0]._id]}}).skip(skip).limit(limit).sort({updatedAt: -1}).populate(["client", "country", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency", "show_created", "show_accepted"]);
            const tasks = await taskModel.find().skip(skip).limit(limit).sort({updatedAt: -1}).populate(["client", "country", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency", "show_created", "show_accepted"]);
            res.json({tasks: tasks, pendingTasks: pendingTasks});
        } else {
            return next(new HttpError("You are not authorized to show tasks!", 401));
        }
    } 
    catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = getMyTasks