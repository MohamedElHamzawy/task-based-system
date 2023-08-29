const clientModel = require("../../DB/client.model");
const accountModel = require("../../DB/account.model");
const HttpError = require("../../common/httpError");

const getAllClients = async (req,res,next) => {
    const allClients = await clientModel.find({});
    res.json({clients: allClients});
}

const getClient = async (req,res,next) => {
    const clientID = req.params.id;
    const thisClient = await clientModel.findById({_id: clientID});
    res.json({client: thisClient});
}

const createClient = async (req,res,next) => {
    const {
        clientName,
        phone,
        email,
        country,
        city
    } = req.body;
    const tryGetClient = await clientModel.findOne({email});
    if (tryGetClient) {
        return next(new HttpError("Client is already existed!", 400));
    } else {
        const newClient = await new clientModel({clientname: clientName, phone, email, country, city}).save();
        await new accountModel({owner: newClient._id, title: newClient.clientname, type: "client"}).save();
        res.json({message: "Client has been added successfully"});
    }
}

const updateClient = async (req,res,next) => {
    const {
        clientName,
        phone,
        email,
        country,
        city
    } = req.body;
    const clientID = req.params.id;
    const tryGetClient = await clientModel.findOne({_id: clientID});
    if (tryGetClient) {
        await clientModel.findByIdAndUpdate({_id: clientID}, {clientname: clientName, phone, email, country, city});
        res.json({message: "Client has been updated successfully"});
    } else {
        return next(new HttpError("Client doesn't exist on system!", 400));
    }
}

const deleteClient = async (req,res,next) => {
    const clientID = req.params.id;
    const tryGetClient = await clientModel.findOne({_id: clientID});
    if (tryGetClient) {
        await clientModel.findByIdAndDelete({_id: clientID});
        await accountModel.findOneAndDelete({owner: clientID});
        res.json({message: "Client has been deleted successfully"});
    } else {
        return next(new HttpError("Client doesn't exist on system!", 400));
    }
}

module.exports = {getAllClients, getClient, createClient, updateClient, deleteClient}