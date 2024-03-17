const noteModel = require("../../../DB/note.model");
const userModel = require("../../../DB/user.model");
const clientModel = require("../../../DB/client.model");
const taskModel = require("../../../DB/task.model");
const HttpError = require("../../../common/httpError");
const statusModel = require("../../../DB/status.model");

const createTask = async (req, res, next) => {
    const { title, description, channel, client, speciality, deadline, task_currency, paid } = req.body;
    const role = req.user.user_role;
    if (role !== "specialistService" && role !== "freelancer") {
        try {
            let statusId;
            paid ? statusId = await statusModel.findOne({slug: "working-on"})._id : statusId = await statusModel.findOne({slug: "waiting-offer"})._id;
            const clientCounrty = await clientModel.findById(client, "country").lean().exec();
            const newTask = await taskModel.create({
                title,
                serialNumber: Math.floor(Math.random() * 1000000),
                description,
                channel,
                client,
                country: clientCounrty.country,
                speciality,
                deadline,
                task_currency,
                paid: paid ? paid : 0,
                created_by: req.user._id,
                taskStatus: statusId
            });
            await Promise.all([
                noteModel.create({ content: `Task has been created by ${req.user.fullname}`, user_id: req.user._id, task_id: newTask._id }),
                userModel.findByIdAndUpdate(newTask.created_by, { $inc: { tasksCount: 1 } }).exec(),
                clientModel.findByIdAndUpdate(newTask.client, { $inc: { tasksCount: 1 } }).exec()
            ]);
            res.json({ message: "Task has been created successfully" });
        } catch (error) {
            return next(new HttpError(`Unexpected Error: ${error}`, 500));
        }
    } else {
        return next(new HttpError("You are not authorized to create task!", 401));
    }
};

module.exports = createTask