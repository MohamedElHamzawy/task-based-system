const {customerProfitModel, specialistProfitModel} = require("../../DB/profit.model");
const HttpError = require("../../common/httpError");

const getCustomerProfit = async (req,res,next) => {
    try {
        const getProfitSystem = await customerProfitModel.find({});
        const profitSystem = getProfitSystem[0];
        res.json({profitSystem});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const createCustomerProfit = async (req,res,next) => {
    try {
        const tryGet = await customerProfitModel.find({});
        if (tryGet.length > 0) {
            return next(new HttpError(`You can't add new profit system`, 404));
        } else {
            const {minimum, maximum} = req.body;
            await new customerProfitModel({minimum, maximum}).save();
            res.json({message:"Profit System Has Been Set Successfully"});
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const updateCustomerProfit = async (req,res,next) => {
    try {
        const {minimum, maximum} = req.body;
        const profitID = req.params.id;
        await customerProfitModel.findByIdAndUpdate({_id: profitID}, {minimum, maximum});
        res.json({message:"Profit system has been updated successfully"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const getspecialistProfit = async (req,res,next) => {
    try {
        const getProfitSystem = await specialistProfitModel.find({});
        const profitSystem = getProfitSystem[0];
        res.json({profitSystem});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const createspecialistProfit = async (req,res,next) => {
    try {
        const tryGet = await specialistProfitModel.find({});
        if (tryGet.length > 0) {
            return next(new HttpError(`You can't add new profit system`, 404));
        } else {
            const {minimum, maximum} = req.body;
            await new specialistProfitModel({minimum, maximum}).save();
            res.json({message:"Profit System Has Been Set Successfully"});
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const updatespecialistProfit = async (req,res,next) => {
    try {
        const {minimum, maximum} = req.body;
        const profitID = req.params.id;
        await specialistProfitModel.findByIdAndUpdate({_id: profitID}, {minimum, maximum});
        res.json({message:"Profit system has been updated successfully"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = {getCustomerProfit, createCustomerProfit, updateCustomerProfit, getspecialistProfit, createspecialistProfit, updatespecialistProfit};