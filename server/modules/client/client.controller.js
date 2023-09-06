const clientModel = require("../../DB/client.model");
const accountModel = require("../../DB/account.model");
const taskModel = require("../../DB/task.model");
const HttpError = require("../../common/httpError");

const getAllClients = async (req,res,next) => {
    try {
        const allClients = await clientModel.find({});
        res.json({clients: allClients});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const getClient = async (req,res,next) => {
    try {
        const clientID = req.params.id;
        const thisClient = await clientModel.findById({_id: clientID});
        const clientTasks = await taskModel.find({client: clientID}).populate(["client", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency"]);
        const clientAccount = await accountModel.find({owner: clientID}).populate("owner");
        res.json({client: thisClient, clientTasks: clientTasks, clientAccount: clientAccount});
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const createClient = async (req,res,next) => {
    try {
        const {
            clientName,
            owner,
            phone,
            website,
            country,
            currency
        } = req.body;
        const tryGetClient = await clientModel.findOne({email});
        if (tryGetClient) {
            return next(new HttpError("Client is already existed!", 400));
        } else {
            const newClient = await new clientModel({clientname: clientName, ownerName: owner, phone, website, country, currency}).save();
            await new accountModel({owner: newClient._id, title: newClient.clientname, type: "client"}).save();
            res.json({message: "Client has been added successfully"});
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const updateClient = async (req,res,next) => {
    try {
        const {
            clientName,
            owner,
            phone,
            website,
            country,
            currency
        } = req.body;
        const clientID = req.params.id;
        const tryGetClient = await clientModel.findOne({_id: clientID});
        if (tryGetClient) {
            await clientModel.findByIdAndUpdate({_id: clientID}, {clientname: clientName, ownerName: owner, phone, website, country, currency});
            res.json({message: "Client has been updated successfully"});
        } else {
            return next(new HttpError("Client doesn't exist on system!", 400));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

const deleteClient = async (req,res,next) => {
    try {
        const clientID = req.params.id;
        const tryGetClient = await clientModel.findOne({_id: clientID});
        if (tryGetClient) {
            await clientModel.findByIdAndDelete({_id: clientID});
            await accountModel.findOneAndDelete({owner: clientID});
            res.json({message: "Client has been deleted successfully"});
        } else {
            return next(new HttpError("Client doesn't exist on system!", 400));
        }
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
}

module.exports = {getAllClients, getClient, createClient, updateClient, deleteClient}