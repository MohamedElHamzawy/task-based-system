const taskModel = require("../../../DB/task.model");
const HttpError = require("../../../common/httpError");

const FilterTasks = async (req,res,next) => {
    try {
        const {status, speciality, country, start, end, freelancer, client, user, sort} = req.body;
        const {page, limit} = req.query;
        const skip = (page - 1) * limit;
        let tasks;
        let filter = {};
        let options = {};

        if (status) filter.taskStatus = status;
        if (speciality) filter.speciality = speciality;
        if (country) filter.country = country;
        if (freelancer) filter.freelancer = freelancer;
        if (client) filter.client = client;
        if (user) filter.$or = [{ created_by: user }, { accepted_by: user }];

        if (sort == "date") {
            options.sort = { deadline: 1 };
            if (end && start) {
                options.gte = { deadline: start };
                options.lte = { deadline: end };
            }
        } else if (sort == "profit") {
            options.sort = { profit_amount: -1 };
            if (end && start) {
                options.gte = { createdAt: start };
                options.lte = { createdAt: end };
            }
        } else {
            options.sort = { createdAt: -1 };
            if (end && start) {
                options.gte = { createdAt: start };
                options.lte = { createdAt: end };
            }
        }
        tasks = await taskModel.find(filter, null, options).skip(skip).limit(limit).populate(["client", "country", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency", "show_created", "show_accepted"]);

        let tasksCount = tasks.length;
        let totalCost = tasks.reduce((acc, task) => acc + (task.cost || 0), 0);
        let totalGain = tasks.reduce((acc, task) => acc + (task.paid || 0) * (task.task_currency.priceToEGP || 1), 0);
        let totalProfit = tasks.reduce((acc, task) => acc + (task.profit_amount || 0), 0);
        const totalProfitPercentage = totalProfit / totalGain * 100 || 0;
        res.json({tasks: tasks, tasksCount: tasksCount, totalCost: totalCost, totalGain: totalGain, totalProfit: totalProfit, totalProfitPercentage: totalProfitPercentage});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = FilterTasks