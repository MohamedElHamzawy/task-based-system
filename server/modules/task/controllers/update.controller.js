const accountModel = require("../../../DB/account.model");
const transactionModel = require("../../../DB/transaction.model");

const updateTask = async (req,res,next) => {
    try {
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
            paid,
            cost,
            profit_amount
        } = req.body;
        const task = await taskModel.findOne({_id: req.params.id});
        if(!task) {
            return next(new HttpError("Task doesn't exist on system!", 404));
        }
        const deliveredStatus = await statusModel.findOne({slug: "delivered"})
        if (task.taskStatus == deliveredStatus._id) {
            let diff = cost ? (cost - task.cost) : 0;
            let dif = paid ? (paid - task.paid) : 0;
            const freelancerAccount = await accountModel.findOne({owner: task.freelancer});
            await transactionModel.findOneAndUpdate(
                {task: req.params.id, account_id: freelancerAccount._id},
                {amount: cost ? cost : task.cost}
            )
            await accountModel.findOneAndUpdate(
                {_id: freelancerAccount},
                {$inc: {balance: diff}}
            )
            const clientAccount = await accountModel.findOne({owner: task.client});
            await transactionModel.findOneAndUpdate(
                {task: req.params.id, account_id: clientAccount._id},
                {amount: paid ? paid : task.paid}
            )
            await accountModel.findOneAndUpdate(
                {_id: clientAccount},
                {$inc: {balance: dif}}
            )
        }
        await taskModel.findOneAndUpdate({_id: req.params.id}, {
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
            paid,
            cost,
            profit_amount
        }, {new: true});
        res.json({message: "Task has been updated successfully"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = updateTask