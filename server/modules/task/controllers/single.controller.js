const commentModel = require("../../../DB/comment.model");
const currencyModel = require("../../../DB/currency.model");
const fileModel = require("../../../DB/file.model");
const noteModel = require("../../../DB/note.model");
const { customerProfitModel, specialistProfitModel } = require("../../../DB/profit.model");
const taskModel = require("../../../DB/task.model");
const HttpError = require("../../../common/httpError");

const getTask = async (req,res,next) => {
    try {
        const role = req.user.user_role;
        const taskID = req.params.id;
        let offer = {};
        const getCustomerProfit = await customerProfitModel.find({});
        const getSpecialistProfit = await specialistProfitModel.find({});

        const customerProfitMinPercentage = getCustomerProfit[0].minimum;
        const customerProfitMaxPercentage = getCustomerProfit[0].maximum;
        const specialistProfitMinPercentage = getSpecialistProfit[0].minimum;
        const specialistProfitMaxPercentage = getSpecialistProfit[0].maximum;

        const task = await taskModel
        .findOne({_id: taskID})
        .populate(["client", "country", "show_created", "show_accepted", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency"]);
        const taskFile = await fileModel.findOne({taskId: taskID});
        const currencyValue = await currencyModel.findOne({_id: task.task_currency}).select("priceToEGP");
        const specialistOfferMax = (task.cost + (task.cost * specialistProfitMaxPercentage/100)) / currencyValue.priceToEGP;
        const specialistOfferMin = (task.cost + (task.cost * specialistProfitMinPercentage/100)) / currencyValue.priceToEGP;
        const customerOfferMax = (task.paid - (task.paid * customerProfitMinPercentage/100)) * currencyValue.priceToEGP;
        const customerOfferMin = (task.paid - (task.paid * customerProfitMaxPercentage/100)) * currencyValue.priceToEGP;
        if (role == "admin") {
            offer = {
                specialistOfferMin,
                specialistOfferMax,
                customerOfferMin,
                customerOfferMax
            };
        } else if (role == "customerService") {
            offer = {
                specialistOfferMin,
                specialistOfferMax
            };
        } else if (role == "specialistService") {
            offer = {
                customerOfferMin,
                customerOfferMax
            };
        } else {
            return next(new HttpError("You are not authorized to show this task!", 401));
        }
        const notes = await noteModel.find({task_id: taskID}).populate(["user_id", "task_id"]);
        const comments = await commentModel.find({task_id: taskID}).populate(["user_id"]);
        let returnTask;
        if (taskFile) {
            returnTask = {
                ...task.toJSON(), file: {name: taskFile.fileName, size: taskFile.fileSize}
            }
        } else {
            returnTask = {
                ...task.toJSON()
            }
        }
        res.json({task: returnTask, file: {name: taskFile.fileName, size: taskFile.fileSize}, comments: comments, notes: notes, offer: offer});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = getTask