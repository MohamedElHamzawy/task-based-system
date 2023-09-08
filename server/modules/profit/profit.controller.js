const profitModel = require("../../DB/profit.model");
const HttpError = require("../../common/httpError");

const createProfit = async (req,res,next) => {
    try {
        const tryGet = await profitModel.find({});
        if (tryGet) {
            return next(new HttpError(`You can't add new profit system`, 404));
        } else {
            const {minimum, maximum} = req.body;
            await new profitModel({minimum, maximum}).save();
            res.json({message:"Profit System Has Been Set Successfully"});
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const updateProfit = async (req,res,next) => {
    try {
        const {minimum, maximum} = req.body;
        const profitID = req.params.id;
        await profitModel.findByIdAndUpdate({_id: profitID}, {minimum, maximum});
        res.json({message:"Profit system has been updated successfully"});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = {createProfit, updateProfit};