const channelModel = require("../../DB/channel.model");

const getAllChannels = async (req,res,next) => {
    const channels = await channelModel.find({});
    res.json({channels: channels});s
}

const getChannel = async (req,res,next) => {
    const channelID = req.params.id;
    const thisChannel = await channelModel.findById({_id: channelID});
    if (thisChannel) {
        res.json({channel: thisChannel});
    } else {
        res.json({error:"This channel doesn't exist on system"});
    }
}

const createChannel  = async (req,res,next) => {
    const {
        name,
        type,
        number,
        description
    } = req.body;
    const tryGetThisChannel = await channelModel.find({channelname: name});
    if (tryGetThisChannel) {
        res.json({error: "This channel alredy exists on system"});
    } else {
        new channelModel({channelname:name, type: type, number: number, description:description});
        res.json({message: "Channel has been created successfully"});
    }
}

const updateChannel = async (req,res,next) => {
    const channelID = req.params.id;
    const {
        name,
        type,
        number,
        description
    } = req.body;

    const tryGetThisChannel = await channelModel.find({_id: channelID});
    if (tryGetThisChannel) {
        await channelModel.findByIdAndUpdate({_id: channelID}, {channelname: name, type: type, number: number, description: description});
        res.json({message: "Channel has been updated successfully"});
    } else {
        res.json({error: "This channel doesn't exist on system"});
    }
}

const deleteChannel = async (req,res,next) => {
    const channelID = req.params.id;

    const tryGetThisChannel = await channelModel.find({_id: channelID});
    if (tryGetThisChannel) {
        await channelModel.findByIdAndDelete({_id: channelID});
        res.json({message: "Channel has been deleted successfully"});
    } else {
        res.json({error: "This channel doesn't exist on system"});
    }
}
module.exports = {getAllChannels, getChannel, createChannel, updateChannel, deleteChannel}