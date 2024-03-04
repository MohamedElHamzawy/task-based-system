const taskModel = require("../../DB/task.model");
const statusModel = require("../../DB/status.model");
const currencyModel = require("../../DB/currency.model");
const noteModel = require("../../DB/note.model");
const HttpError = require("../../common/httpError");
const commentModel = require("../../DB/comment.model");
const {
  customerProfitModel,
  specialistProfitModel,
} = require("../../DB/profit.model");
const userModel = require("../../DB/user.model");
const clientModel = require("../../DB/client.model");
const sendNotification = require("../notification/notification.controller");

const {
  acceptTask,
  confirmTaskB,
  makeOffer,
  confirmTaskA,
  refuseTask,
  deliverTask,
  editTask,
  deleteDeliveredTask,
  deleteNormalTask,
  pushFile,
} = require("./task.functions");
const fileModel = require("../../DB/file.model");

const getMyTasks = async (req, res, next) => {
  try {
    const role = req.user.user_role;

    if (role == "admin") {
      const tasks = await taskModel
        .find({})
        .sort({ updatedAt: -1 })
        .populate([
          "client",
          "country",
          "freelancer",
          "speciality",
          "taskStatus",
          "created_by",
          "accepted_by",
          "task_currency",
          "show_created",
          "show_accepted",
        ]);
      const tasksCount = tasks.length;
      const completedTasks = await taskModel.find({
        taskStatus: "651737dce979f2bb0fb8a3d2",
      });
      const completedCount = completedTasks.length;
      console.log("freelancer" + req.freelancer);
      console.log("user" + req.user);
      let totalCost = 0;
      let totalGain = 0;
      let totalProfit = 0;
      tasks.forEach((task) => {
        task.cost ? (totalCost += task.cost) : (totalCost += 0);
        task.paid
          ? (totalGain += task.paid * task.task_currency.priceToEGP)
          : (totalGain += 0);
        task.profit_amount
          ? (totalProfit += task.profit_amount)
          : (totalProfit += 0);
      });
      const totalProfitPercentage = (totalProfit / totalGain) * 100;
      // await sendNotification(req.body.token,"Task is","Get it")
      res.json({
        tasks: tasks,
        tasksCount: tasksCount,
        completedCount: completedCount,
        totalCost: totalCost,
        totalGain: totalGain,
        totalProfit: totalProfit,
        totalProfitPercentage: totalProfitPercentage.toFixed(2),
      });
    } else if (role == "customerService") {
      const status1 = await statusModel.find({ slug: "offer-submitted" });
      const status2 = await statusModel.find({ slug: "on-going" });
      const status3 = await statusModel.find({ slug: "done" });
      const pendingTasks = await taskModel
        .find({
          $and: [
            {
              $or: [
                { created_by: req.user._id },
                { show_created: req.user._id },
              ],
            },
            {
              taskStatus: {
                $in: [status1[0]._id, status2[0]._id, status3[0]._id],
              },
            },
          ],
        })
        .sort({ updatedAt: -1 })
        .populate([
          "client",
          "country",
          "freelancer",
          "speciality",
          "taskStatus",
          "created_by",
          "accepted_by",
          "task_currency",
          "show_created",
          "show_accepted",
        ]);
      const tasks = await taskModel
        .find({
          $or: [{ created_by: req.user._id }, { show_created: req.user._id }],
        })
        .sort({ updatedAt: -1 })
        .populate([
          "client",
          "country",
          "freelancer",
          "speciality",
          "taskStatus",
          "created_by",
          "accepted_by",
          "task_currency",
          "show_created",
          "show_accepted",
        ]);
      res.json({ tasks: tasks, pendingTasks: pendingTasks });
    } else if (role == "specialistService") {
      let pendingTasksB;
      const status1 = await statusModel.find({ slug: "waiting-offer" });
      const status2 = await statusModel.find({ slug: "approved" });
      const status3 = await statusModel.find({ slug: "edit" });
      const status4 = await statusModel.find({ slug: "working-on" });
      // const specialityName = await specialityModel.findOne({_id: req.user.speciality}).select("speciality");
      // if (specialityName.speciality == "All") {
      //     pendingTasksB = await taskModel.find({$and: [{$or: [{accepted_by: req.user._id}, {show_accepted: req.user._id}]}, {taskStatus: {$in: [status1[0]._id, status2[0]._id, status3[0]._id, status4[0]._id]}}]}).sort({deadline: 1}).populate(["client", "country", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency", "show_created", "show_accepted"]);
      // } else {
      //     const userSpeciality = await specialityModel.find({$or: [{speciality: specialityName.speciality}, {speciality: "All"}]}).select("_id");
      //     pendingTasksB = await taskModel.find({$or: [{speciality: {$in: userSpeciality}}, {$and: [{$or: [{accepted_by: req.user._id}, {show_accepted: req.user._id}]}, {taskStatus: {$in: [status1[0]._id, status2[0]._id, status3[0]._id, status4[0]._id]}}]}]}).sort({deadline: 1}).populate(["client", "country", "freelancer", "speciality", "taskStatus", "created_by", "accepted_by", "task_currency", "show_created", "show_accepted"]);
      // }
      const pendingTasks = await taskModel
        .find({
          taskStatus: {
            $in: [
              status1[0]._id,
              status2[0]._id,
              status3[0]._id,
              status4[0]._id,
            ],
          },
        })
        .sort({ updatedAt: -1 })
        .populate([
          "client",
          "country",
          "freelancer",
          "speciality",
          "taskStatus",
          "created_by",
          "accepted_by",
          "task_currency",
          "show_created",
          "show_accepted",
        ]);
      const myTasks = await taskModel
        .find({
          $or: [{ accepted_by: req.user._id }, { show_accepted: req.user._id }],
        })
        .sort({ updatedAt: -1 })
        .populate([
          "client",
          "country",
          "freelancer",
          "speciality",
          "taskStatus",
          "created_by",
          "accepted_by",
          "task_currency",
          "show_created",
          "show_accepted",
        ]);
      res.json({ myTasks: myTasks, pendingTasks: pendingTasks });
    } else if (role == "freelancer") {
      console.log(req.user._id);
      const myTasks = await taskModel
        .find({
          $and: [{ direct_to: role }, { speciality: req.user.speciality }],
        })
        .sort({ updatedAt: -1 });

      res.json(myTasks);
    } else {
      return next(new HttpError("You are not authorized to show tasks!", 401));
    }
  } catch (error) {
    return next(new HttpError(`Unexpected Error: ${error}`, 500));
  }
};

const FilterTasks = async (req, res, next) => {
  try {
    const {
      status,
      speciality,
      country,
      start,
      end,
      freelancer,
      client,
      user,
      sort,
    } = req.body;
    let tasks;
    if (sort == "date") {
      if (user) {
        const theUser = await userModel.findOne({ _id: user });
        if (theUser.user_role == "customerService") {
          if (end && start) {
            tasks = await taskModel
              .find({
                $and: [
                  status ? { taskStatus: status } : {},
                  speciality ? { speciality: speciality } : {},
                  country ? { country: country } : {},
                  freelancer ? { freelancer: freelancer } : {},
                  client ? { client: client } : {},
                  user ? { created_by: theUser._id } : {},
                ],
              })
              .gte("deadline", start)
              .lte("deadline", end)
              .sort({ deadline: 1 })
              .populate([
                "client",
                "country",
                "freelancer",
                "speciality",
                "taskStatus",
                "created_by",
                "accepted_by",
                "task_currency",
                "show_created",
                "show_accepted",
              ]);
          } else {
            tasks = await taskModel
              .find({
                $and: [
                  status ? { taskStatus: status } : {},
                  speciality ? { speciality: speciality } : {},
                  country ? { country: country } : {},
                  freelancer ? { freelancer: freelancer } : {},
                  client ? { client: client } : {},
                  user ? { created_by: theUser._id } : {},
                ],
              })
              .sort({ deadline: 1 })
              .populate([
                "client",
                "country",
                "freelancer",
                "speciality",
                "taskStatus",
                "created_by",
                "accepted_by",
                "task_currency",
                "show_created",
                "show_accepted",
              ]);
          }
        } else if (theUser.user_role == "specialistService") {
          if (end && start) {
            tasks = await taskModel
              .find({
                $and: [
                  status ? { taskStatus: status } : {},
                  speciality ? { speciality: speciality } : {},
                  country ? { country: country } : {},
                  freelancer ? { freelancer: freelancer } : {},
                  client ? { client: client } : {},
                  user ? { accepted_by: theUser._id } : {},
                ],
              })
              .gte("deadline", start)
              .lte("deadline", end)
              .sort({ deadline: 1 })
              .populate([
                "client",
                "country",
                "freelancer",
                "speciality",
                "taskStatus",
                "created_by",
                "accepted_by",
                "task_currency",
                "show_created",
                "show_accepted",
              ]);
          } else {
            tasks = await taskModel
              .find({
                $and: [
                  status ? { taskStatus: status } : {},
                  speciality ? { speciality: speciality } : {},
                  country ? { country: country } : {},
                  freelancer ? { freelancer: freelancer } : {},
                  client ? { client: client } : {},
                  user ? { accepted_by: theUser._id } : {},
                ],
              })
              .sort({ deadline: 1 })
              .populate([
                "client",
                "country",
                "freelancer",
                "speciality",
                "taskStatus",
                "created_by",
                "accepted_by",
                "task_currency",
                "show_created",
                "show_accepted",
              ]);
          }
        } else {
          if (end && start) {
            tasks = await taskModel
              .find({
                $and: [
                  status ? { taskStatus: status } : {},
                  speciality ? { speciality: speciality } : {},
                  country ? { country: country } : {},
                  freelancer ? { freelancer: freelancer } : {},
                  client ? { client: client } : {},
                  {
                    $or: [
                      { created_by: theUser._id },
                      { accepted_by: theUser._id },
                    ],
                  },
                ],
              })
              .gte("deadline", start)
              .lte("deadline", end)
              .sort({ deadline: 1 })
              .populate([
                "client",
                "country",
                "freelancer",
                "speciality",
                "taskStatus",
                "created_by",
                "accepted_by",
                "task_currency",
                "show_created",
                "show_accepted",
              ]);
          } else {
            tasks = await taskModel
              .find({
                $and: [
                  status ? { taskStatus: status } : {},
                  speciality ? { speciality: speciality } : {},
                  country ? { country: country } : {},
                  freelancer ? { freelancer: freelancer } : {},
                  client ? { client: client } : {},
                  {
                    $or: [
                      { created_by: theUser._id },
                      { accepted_by: theUser._id },
                    ],
                  },
                ],
              })
              .sort({ deadline: 1 })
              .populate([
                "client",
                "country",
                "freelancer",
                "speciality",
                "taskStatus",
                "created_by",
                "accepted_by",
                "task_currency",
                "show_created",
                "show_accepted",
              ]);
          }
        }
      } else {
        if (end && start) {
          tasks = await taskModel
            .find({
              $and: [
                status ? { taskStatus: status } : {},
                speciality ? { speciality: speciality } : {},
                country ? { country: country } : {},
                freelancer ? { freelancer: freelancer } : {},
                client ? { client: client } : {},
              ],
            })
            .gte("deadline", start)
            .lte("deadline", end)
            .sort({ deadline: 1 })
            .populate([
              "client",
              "country",
              "freelancer",
              "speciality",
              "taskStatus",
              "created_by",
              "accepted_by",
              "task_currency",
              "show_created",
              "show_accepted",
            ]);
        } else {
          tasks = await taskModel
            .find({
              $and: [
                status ? { taskStatus: status } : {},
                speciality ? { speciality: speciality } : {},
                country ? { country: country } : {},
                freelancer ? { freelancer: freelancer } : {},
                client ? { client: client } : {},
              ],
            })
            .sort({ deadline: 1 })
            .populate([
              "client",
              "country",
              "freelancer",
              "speciality",
              "taskStatus",
              "created_by",
              "accepted_by",
              "task_currency",
              "show_created",
              "show_accepted",
            ]);
        }
      }
    } else if (sort == "profit") {
      if (user) {
        const theUser = await userModel.findOne({ _id: user });
        if (theUser.user_role == "customerService") {
          if (end && start) {
            tasks = await taskModel
              .find({
                $and: [
                  status ? { taskStatus: status } : {},
                  speciality ? { speciality: speciality } : {},
                  country ? { country: country } : {},
                  freelancer ? { freelancer: freelancer } : {},
                  client ? { client: client } : {},
                  user ? { created_by: theUser._id } : {},
                ],
              })
              .gte("createdAt", start)
              .lte("createdAt", end)
              .sort({ profit_amount: -1 })
              .populate([
                "client",
                "country",
                "freelancer",
                "speciality",
                "taskStatus",
                "created_by",
                "accepted_by",
                "task_currency",
                "show_created",
                "show_accepted",
              ]);
          } else {
            tasks = await taskModel
              .find({
                $and: [
                  status ? { taskStatus: status } : {},
                  speciality ? { speciality: speciality } : {},
                  country ? { country: country } : {},
                  freelancer ? { freelancer: freelancer } : {},
                  client ? { client: client } : {},
                  user ? { created_by: theUser._id } : {},
                ],
              })
              .sort({ profit_amount: -1 })
              .populate([
                "client",
                "country",
                "freelancer",
                "speciality",
                "taskStatus",
                "created_by",
                "accepted_by",
                "task_currency",
                "show_created",
                "show_accepted",
              ]);
          }
        } else if (theUser.user_role == "specialistService") {
          if (end && start) {
            tasks = await taskModel
              .find({
                $and: [
                  status ? { taskStatus: status } : {},
                  speciality ? { speciality: speciality } : {},
                  country ? { country: country } : {},
                  freelancer ? { freelancer: freelancer } : {},
                  client ? { client: client } : {},
                  user ? { accepted_by: theUser._id } : {},
                ],
              })
              .gte("createdAt", start)
              .lte("createdAt", end)
              .sort({ profit_amount: -1 })
              .populate([
                "client",
                "country",
                "freelancer",
                "speciality",
                "taskStatus",
                "created_by",
                "accepted_by",
                "task_currency",
                "show_created",
                "show_accepted",
              ]);
          } else {
            tasks = await taskModel
              .find({
                $and: [
                  status ? { taskStatus: status } : {},
                  speciality ? { speciality: speciality } : {},
                  country ? { country: country } : {},
                  freelancer ? { freelancer: freelancer } : {},
                  client ? { client: client } : {},
                  user ? { accepted_by: theUser._id } : {},
                ],
              })
              .sort({ profit_amount: -1 })
              .populate([
                "client",
                "country",
                "freelancer",
                "speciality",
                "taskStatus",
                "created_by",
                "accepted_by",
                "task_currency",
                "show_created",
                "show_accepted",
              ]);
          }
        } else {
          if (end && start) {
            tasks = await taskModel
              .find({
                $and: [
                  status ? { taskStatus: status } : {},
                  speciality ? { speciality: speciality } : {},
                  country ? { country: country } : {},
                  freelancer ? { freelancer: freelancer } : {},
                  client ? { client: client } : {},
                  {
                    $or: [
                      { created_by: theUser._id },
                      { accepted_by: theUser._id },
                    ],
                  },
                ],
              })
              .gte("createdAt", start)
              .lte("createdAt", end)
              .sort({ profit_amount: -1 })
              .populate([
                "client",
                "country",
                "freelancer",
                "speciality",
                "taskStatus",
                "created_by",
                "accepted_by",
                "task_currency",
                "show_created",
                "show_accepted",
              ]);
          } else {
            tasks = await taskModel
              .find({
                $and: [
                  status ? { taskStatus: status } : {},
                  speciality ? { speciality: speciality } : {},
                  country ? { country: country } : {},
                  freelancer ? { freelancer: freelancer } : {},
                  client ? { client: client } : {},
                  {
                    $or: [
                      { created_by: theUser._id },
                      { accepted_by: theUser._id },
                    ],
                  },
                ],
              })
              .sort({ profit_amount: -1 })
              .populate([
                "client",
                "country",
                "freelancer",
                "speciality",
                "taskStatus",
                "created_by",
                "accepted_by",
                "task_currency",
                "show_created",
                "show_accepted",
              ]);
          }
        }
      } else {
        if (end && start) {
          tasks = await taskModel
            .find({
              $and: [
                status ? { taskStatus: status } : {},
                speciality ? { speciality: speciality } : {},
                country ? { country: country } : {},
                freelancer ? { freelancer: freelancer } : {},
                client ? { client: client } : {},
              ],
            })
            .gte("createdAt", start)
            .lte("createdAt", end)
            .sort({ profit_amount: -1 })
            .populate([
              "client",
              "country",
              "freelancer",
              "speciality",
              "taskStatus",
              "created_by",
              "accepted_by",
              "task_currency",
              "show_created",
              "show_accepted",
            ]);
        } else {
          tasks = await taskModel
            .find({
              $and: [
                status ? { taskStatus: status } : {},
                speciality ? { speciality: speciality } : {},
                country ? { country: country } : {},
                freelancer ? { freelancer: freelancer } : {},
                client ? { client: client } : {},
              ],
            })
            .sort({ profit_amount: -1 })
            .populate([
              "client",
              "country",
              "freelancer",
              "speciality",
              "taskStatus",
              "created_by",
              "accepted_by",
              "task_currency",
              "show_created",
              "show_accepted",
            ]);
        }
      }
    } else {
      if (user) {
        const theUser = await userModel.findOne({ _id: user });
        if (theUser.user_role == "customerService") {
          if (end && start) {
            tasks = await taskModel
              .find({
                $and: [
                  status ? { taskStatus: status } : {},
                  speciality ? { speciality: speciality } : {},
                  country ? { country: country } : {},
                  freelancer ? { freelancer: freelancer } : {},
                  client ? { client: client } : {},
                  user ? { created_by: theUser._id } : {},
                ],
              })
              .gte("createdAt", start)
              .lte("createdAt", end)
              .sort({ createdAt: -1 })
              .populate([
                "client",
                "country",
                "freelancer",
                "speciality",
                "taskStatus",
                "created_by",
                "accepted_by",
                "task_currency",
                "show_created",
                "show_accepted",
              ]);
          } else {
            tasks = await taskModel
              .find({
                $and: [
                  status ? { taskStatus: status } : {},
                  speciality ? { speciality: speciality } : {},
                  country ? { country: country } : {},
                  freelancer ? { freelancer: freelancer } : {},
                  client ? { client: client } : {},
                  user ? { created_by: theUser._id } : {},
                ],
              })
              .sort({ createdAt: -1 })
              .populate([
                "client",
                "country",
                "freelancer",
                "speciality",
                "taskStatus",
                "created_by",
                "accepted_by",
                "task_currency",
                "show_created",
                "show_accepted",
              ]);
          }
        } else if (theUser.user_role == "specialistService") {
          if (end && start) {
            tasks = await taskModel
              .find({
                $and: [
                  status ? { taskStatus: status } : {},
                  speciality ? { speciality: speciality } : {},
                  country ? { country: country } : {},
                  freelancer ? { freelancer: freelancer } : {},
                  client ? { client: client } : {},
                  user ? { accepted_by: theUser._id } : {},
                ],
              })
              .gte("createdAt", start)
              .lte("createdAt", end)
              .sort({ createdAt: -1 })
              .populate([
                "client",
                "country",
                "freelancer",
                "speciality",
                "taskStatus",
                "created_by",
                "accepted_by",
                "task_currency",
                "show_created",
                "show_accepted",
              ]);
          } else {
            tasks = await taskModel
              .find({
                $and: [
                  status ? { taskStatus: status } : {},
                  speciality ? { speciality: speciality } : {},
                  country ? { country: country } : {},
                  freelancer ? { freelancer: freelancer } : {},
                  client ? { client: client } : {},
                  user ? { accepted_by: theUser._id } : {},
                ],
              })
              .sort({ createdAt: -1 })
              .populate([
                "client",
                "country",
                "freelancer",
                "speciality",
                "taskStatus",
                "created_by",
                "accepted_by",
                "task_currency",
                "show_created",
                "show_accepted",
              ]);
          }
        } else {
          if (end && start) {
            tasks = await taskModel
              .find({
                $and: [
                  status ? { taskStatus: status } : {},
                  speciality ? { speciality: speciality } : {},
                  country ? { country: country } : {},
                  freelancer ? { freelancer: freelancer } : {},
                  client ? { client: client } : {},
                  {
                    $or: [
                      { created_by: theUser._id },
                      { accepted_by: theUser._id },
                    ],
                  },
                ],
              })
              .gte("createdAt", start)
              .lte("createdAt", end)
              .sort({ createdAt: -1 })
              .populate([
                "client",
                "country",
                "freelancer",
                "speciality",
                "taskStatus",
                "created_by",
                "accepted_by",
                "task_currency",
                "show_created",
                "show_accepted",
              ]);
          } else {
            tasks = await taskModel
              .find({
                $and: [
                  status ? { taskStatus: status } : {},
                  speciality ? { speciality: speciality } : {},
                  country ? { country: country } : {},
                  freelancer ? { freelancer: freelancer } : {},
                  client ? { client: client } : {},
                  {
                    $or: [
                      { created_by: theUser._id },
                      { accepted_by: theUser._id },
                    ],
                  },
                ],
              })
              .sort({ createdAt: -1 })
              .populate([
                "client",
                "country",
                "freelancer",
                "speciality",
                "taskStatus",
                "created_by",
                "accepted_by",
                "task_currency",
                "show_created",
                "show_accepted",
              ]);
          }
        }
      } else {
        if (end && start) {
          tasks = await taskModel
            .find({
              $and: [
                status ? { taskStatus: status } : {},
                speciality ? { speciality: speciality } : {},
                country ? { country: country } : {},
                freelancer ? { freelancer: freelancer } : {},
                client ? { client: client } : {},
              ],
            })
            .gte("createdAt", start)
            .lte("createdAt", end)
            .sort({ createdAt: -1 })
            .populate([
              "client",
              "country",
              "freelancer",
              "speciality",
              "taskStatus",
              "created_by",
              "accepted_by",
              "task_currency",
              "show_created",
              "show_accepted",
            ]);
        } else {
          tasks = await taskModel
            .find({
              $and: [
                status ? { taskStatus: status } : {},
                speciality ? { speciality: speciality } : {},
                country ? { country: country } : {},
                freelancer ? { freelancer: freelancer } : {},
                client ? { client: client } : {},
              ],
            })
            .sort({ createdAt: -1 })
            .populate([
              "client",
              "country",
              "freelancer",
              "speciality",
              "taskStatus",
              "created_by",
              "accepted_by",
              "task_currency",
              "show_created",
              "show_accepted",
            ]);
        }
      }
    }
    const tasksCount = tasks.length;
    let totalCost = 0;
    let totalGain = 0;
    let totalProfit = 0;
    tasks.forEach((task) => {
      task.cost ? (totalCost += task.cost) : (totalCost += 0);
      task.paid
        ? (totalGain += task.paid * task.task_currency.priceToEGP)
        : (totalGain += 0);
      task.profit_amount
        ? (totalProfit += task.profit_amount)
        : (totalProfit += 0);
    });
    const totalProfitPercentage = (totalProfit / totalGain) * 100;
    res.json({
      tasks: tasks,
      tasksCount: tasksCount,
      totalCost: totalCost,
      totalGain: totalGain,
      totalProfit: totalProfit,
      totalProfitPercentage: totalProfitPercentage,
    });
  } catch (error) {
    return next(new HttpError(`Unexpected Error: ${error}`, 500));
  }
};
const FilterTasksA = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const { status, speciality, country, start, end, freelancer, client } =
      req.body;
    let tasks;
    if (end && start) {
      tasks = await taskModel
        .find({
          $and: [
            { $or: [{ created_by: userID }, { show_created: userID }] },
            status ? { taskStatus: status } : {},
            speciality ? { speciality: speciality } : {},
            country ? { country: country } : {},
            freelancer ? { freelancer: freelancer } : {},
            client ? { client: client } : {},
          ],
        })
        .gte("deadline", start)
        .lte("deadline", end)
        .sort({ deadline: 1 })
        .populate([
          "client",
          "country",
          "freelancer",
          "speciality",
          "taskStatus",
          "created_by",
          "accepted_by",
          "task_currency",
          "show_created",
          "show_accepted",
        ]);
    } else {
      tasks = await taskModel
        .find({
          $and: [
            { $or: [{ created_by: userID }, { show_created: userID }] },
            status ? { taskStatus: status } : {},
            speciality ? { speciality: speciality } : {},
            country ? { country: country } : {},
            freelancer ? { freelancer: freelancer } : {},
            client ? { client: client } : {},
          ],
        })
        .sort({ deadline: 1 })
        .populate([
          "client",
          "country",
          "freelancer",
          "speciality",
          "taskStatus",
          "created_by",
          "accepted_by",
          "task_currency",
          "show_created",
          "show_accepted",
        ]);
    }
    const tasksCount = tasks.length;
    let totalCost = 0;
    let totalGain = 0;
    let totalProfit = 0;
    tasks.forEach((task) => {
      task.cost ? (totalCost += task.cost) : (totalCost += 0);
      task.paid
        ? (totalGain += task.paid * task.task_currency.priceToEGP)
        : (totalGain += 0);
      task.profit_amount
        ? (totalProfit += task.profit_amount)
        : (totalProfit += 0);
    });
    const totalProfitPercentage = (totalProfit / totalGain) * 100;
    res.json({
      tasks: tasks,
      tasksCount: tasksCount,
      totalCost: totalCost,
      totalGain: totalGain,
      totalProfit: totalProfit,
      totalProfitPercentage: totalProfitPercentage,
    });
  } catch (error) {
    return next(new HttpError(`Unexpected Error: ${error}`, 500));
  }
};
const FilterTasksB = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const { status, speciality, country, start, end, freelancer, client } =
      req.body;
    let tasks;
    if (end && start) {
      tasks = await taskModel
        .find({
          $and: [
            { $or: [{ accepted_by: userID }, { show_accepted: userID }] },
            status ? { taskStatus: status } : {},
            speciality ? { speciality: speciality } : {},
            country ? { country: country } : {},
            freelancer ? { freelancer: freelancer } : {},
            client ? { client: client } : {},
          ],
        })
        .gte("deadline", start)
        .lte("deadline", end)
        .sort({ deadline: 1 })
        .populate([
          "client",
          "country",
          "freelancer",
          "speciality",
          "taskStatus",
          "created_by",
          "accepted_by",
          "task_currency",
          "show_created",
          "show_accepted",
        ]);
    } else {
      tasks = await taskModel
        .find({
          $and: [
            { $or: [{ accepted_by: userID }, { show_accepted: userID }] },
            status ? { taskStatus: status } : {},
            speciality ? { speciality: speciality } : {},
            country ? { country: country } : {},
            freelancer ? { freelancer: freelancer } : {},
            client ? { client: client } : {},
          ],
        })
        .sort({ deadline: 1 })
        .populate([
          "client",
          "country",
          "freelancer",
          "speciality",
          "taskStatus",
          "created_by",
          "accepted_by",
          "task_currency",
          "show_created",
          "show_accepted",
        ]);
    }
    const tasksCount = tasks.length;
    let totalCost = 0;
    let totalGain = 0;
    let totalProfit = 0;
    tasks.forEach((task) => {
      task.cost ? (totalCost += task.cost) : (totalCost += 0);
      task.paid
        ? (totalGain += task.paid * task.task_currency.priceToEGP)
        : (totalGain += 0);
      task.profit_amount
        ? (totalProfit += task.profit_amount)
        : (totalProfit += 0);
    });
    const totalProfitPercentage = (totalProfit / totalGain) * 100;
    res.json({
      tasks: tasks,
      tasksCount: tasksCount,
      totalCost: totalCost,
      totalGain: totalGain,
      totalProfit: totalProfit,
      totalProfitPercentage: totalProfitPercentage,
    });
  } catch (error) {
    return next(new HttpError(`Unexpected Error: ${error}`, 500));
  }
};

const getTask = async (req, res, next) => {
  try {
    const role = req.user.user_role;
    const taskID = req.params.id;
    const getCustomerProfit = await customerProfitModel.find({});
    const getSpecialistProfit = await specialistProfitModel.find({});

    const customerProfitMinPercentage = getCustomerProfit[0].minimum;
    const customerProfitMaxPercentage = getCustomerProfit[0].maximum;

    const specialistProfitMinPercentage = getSpecialistProfit[0].minimum;
    const specialistProfitMaxPercentage = getSpecialistProfit[0].maximum;
    if (role == "admin") {
      const task = await taskModel
        .findOne({ _id: taskID })
        .populate([
          "client",
          "country",
          "show_created",
          "show_accepted",
          "freelancer",
          "speciality",
          "taskStatus",
          "created_by",
          "accepted_by",
          "task_currency",
        ]);
      const currencyValue = await currencyModel
        .findOne({ _id: task.task_currency })
        .select("priceToEGP");
      const specialistOfferMax =
        (task.cost + (task.cost * specialistProfitMaxPercentage) / 100) /
        currencyValue.priceToEGP;
      const specialistOfferMin =
        (task.cost + (task.cost * specialistProfitMinPercentage) / 100) /
        currencyValue.priceToEGP;
      const customerOfferMax =
        (task.paid - (task.paid * customerProfitMinPercentage) / 100) *
        currencyValue.priceToEGP;
      const customerOfferMin =
        (task.paid - (task.paid * customerProfitMaxPercentage) / 100) *
        currencyValue.priceToEGP;
      const offer = {
        specialistOfferMin,
        specialistOfferMax,
        customerOfferMin,
        customerOfferMax,
      };
      const notes = await noteModel
        .find({ task_id: taskID })
        .populate(["user_id", "task_id"]);
      const comments = await commentModel
        .find({ task_id: taskID })
        .populate(["user_id"]);
      res.json({ task: task, comments: comments, notes: notes, offer: offer });
    } else if (role == "customerService") {
      const task = await taskModel
        .findOne({
          $and: [
            { _id: taskID },
            {
              $or: [
                { created_by: req.user._id },
                { show_created: req.user._id },
              ],
            },
          ],
        })
        .populate([
          "client",
          "country",
          "show_created",
          "show_accepted",
          "freelancer",
          "speciality",
          "taskStatus",
          "created_by",
          "accepted_by",
          "task_currency",
        ]);
      const currencyValue = await currencyModel
        .findOne({ _id: task.task_currency })
        .select("priceToEGP");
      const specialistOfferMax =
        (task.cost + (task.cost * specialistProfitMaxPercentage) / 100) /
        currencyValue.priceToEGP;
      const specialistOfferMin =
        (task.cost + (task.cost * specialistProfitMinPercentage) / 100) /
        currencyValue.priceToEGP;
      const offer = {
        specialistOfferMin,
        specialistOfferMax,
      };
      const notes = await noteModel
        .find({ task_id: taskID })
        .populate(["user_id", "task_id"]);
      const comments = await commentModel
        .find({ task_id: taskID })
        .populate(["user_id"]);
      res.json({ task: task, comments: comments, notes: notes, offer: offer });
    } else if (role == "specialistService") {
      const task = await taskModel
        .findOne({
          $and: [
            { _id: taskID },
            {
              $or: [
                { accepted_by: req.user._id },
                { show_accepted: req.user._id },
                { accepted: false },
              ],
            },
          ],
        })
        .populate([
          "client",
          "country",
          "show_created",
          "show_accepted",
          "freelancer",
          "speciality",
          "taskStatus",
          "created_by",
          "accepted_by",
          "task_currency",
        ]);
      const currencyValue = await currencyModel
        .findOne({ _id: task.task_currency })
        .select("priceToEGP");
      const customerOfferMax =
        (task.paid - (task.paid * customerProfitMinPercentage) / 100) *
        currencyValue.priceToEGP;
      const customerOfferMin =
        (task.paid - (task.paid * customerProfitMaxPercentage) / 100) *
        currencyValue.priceToEGP;
      const offer = {
        customerOfferMin,
        customerOfferMax,
      };
      const notes = await noteModel
        .find({ task_id: taskID })
        .populate(["user_id", "task_id"]);
      const comments = await commentModel
        .find({ task_id: taskID })
        .populate(["user_id"]);
      res.json({ task: task, comments: comments, notes: notes, offer: offer });
    } else {
      return next(
        new HttpError("You are not authorized to show this task!", 401)
      );
    }
  } catch (error) {
    return next(new HttpError(`Unexpected Error: ${error}`, 500));
  }
};

const createTask = async (req, res, next) => {
  try {
    const role = req.user.user_role;
    if (role != "specialistService" && role != "freelancer") {
      const {
        title,
        description,
        channel,
        client,
        shareWith,
        speciality,
        deadline,
        task_currency,
        paid,
        status,
        direct_to,
      } = req.body;
      const clientCounrty = await clientModel
        .findById({ _id: client })
        .select("country");
      let newTask;
      if (shareWith) {
        newTask = await new taskModel({
          title,
          serialNumber: Math.floor(Math.random() * 1000000).toString(),
          description,
          channel,
          client,
          country: clientCounrty.country,
          speciality,
          deadline,
          task_currency,
          paid,
          created_by: req.user._id,
          show_created: shareWith,
          taskStatus: status,
          direct_to,
        }).save();
      } else {
        newTask = await new taskModel({
          title,
          serialNumber: Math.floor(Math.random() * 1000000),
          description,
          channel,
          client,
          country: clientCounrty.country,
          speciality,
          deadline,
          task_currency,
          paid,
          created_by: req.user._id,
          taskStatus: status,
          direct_to,
        }).save();
      }
      const date = new Date().toLocaleString("en-US", {
        timeZone: "Africa/Cairo",
      });
      await new noteModel({
        content: `Task has been created by ${req.user.fullname} in ${date}`,
        user_id: req.user._id,
        task_id: newTask._id,
      }).save();
      const userA = await userModel.findById({ _id: newTask.created_by });
      const newuserATasksCount = userA.tasksCount + 1;
      await userModel.findByIdAndUpdate(
        { _id: req.user._id },
        { tasksCount: newuserATasksCount }
      );
      const thisClient = await clientModel.findById({ _id: newTask.client });
      const newClientTasksCount = thisClient.tasksCount + 1;
      await clientModel.findByIdAndUpdate(
        { _id: client },
        { tasksCount: newClientTasksCount }
      );
      res.json({ message: "Task has been created successfully" });
    } else {
      return next(new HttpError("You are not authorized to create task!", 401));
    }
  } catch (error) {
    return next(new HttpError(`Unexpected Error: ${error}`, 500));
  }
};

const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
  );
};

const partialUpdateTask = async (req, res, next) => {
  try {
    const role = req.user.user_role;
    const taskID = req.params.id;
    const { statusID } = req.body;
    const taskSerial = await taskModel
      .findOne({ _id: taskID })
      .select("serialNumber");
    const currentStatus = await statusModel.findById({ _id: statusID });
    if (currentStatus.slug == "working-on" && role != "customerService") {
      const { shareWith } = req.body;
      const checkAccepted = await taskModel.findOne({ _id: taskID });
      if (checkAccepted.accepted == false) {
        const msg = await acceptTask(
          taskID,
          req.user.fullname,
          req.user._id,
          shareWith
        );
        const task = await taskModel.findByIdAndUpdate(
          { _id: taskID },
          { taskStatus: statusID }
        );
        const customer = await userModel.findById(task.created_by._id);
        await sendNotification(
          customer.deviceToken,
          "Task is",
          currentStatus.slug
        );

        res.json({ msg });
      } else {
        await taskModel.findByIdAndUpdate(
          { _id: taskID },
          { taskStatus: statusID }
        );
        res.json({ msg: "Done" });
      }
    } else if (
      currentStatus.slug == "waiting-offer" &&
      role != "specialistService"
    ) {
      await taskModel.findByIdAndUpdate(
        { _id: taskID },
        { taskStatus: statusID }
      );
      const date = new Date().toLocaleString("en-US", {
        timeZone: "Africa/Cairo",
      });
      await new noteModel({
        content: `${req.user.fullname} has set task ${taskSerial.serialNumber} to be waiting offer in ${date}`,
        user_id: req.user._id,
        task_id: taskID,
      }).save();
      res.json({ msg: "Task set to waiting offer successfully" });
    } else if (
      currentStatus.slug == "not-available" &&
      role != "customerService"
    ) {
      await taskModel.findByIdAndUpdate(
        { _id: taskID },
        { taskStatus: statusID }
      );
      const date = new Date().toLocaleString("en-US", {
        timeZone: "Africa/Cairo",
      });
      await new noteModel({
        content: `${req.user.fullname} has set task ${taskSerial.serialNumber} to be unavailable in ${date}`,
        user_id: req.user._id,
        task_id: taskID,
      }).save();
      res.json({ msg: "Task set to not available successfully" });
    } else if (currentStatus.slug == "on-going" && role != "customerService") {
      const { freelancerID, cost, shareWith } = req.body;
      if (freelancerID || cost || shareWith) {
        const checkAccepted = await taskModel.findOne({ _id: taskID });
        if (checkAccepted.accepted == false) {
          await acceptTask(taskID, req.user.fullname, req.user._id, shareWith);
          const msg = await confirmTaskB(
            taskID,
            freelancerID,
            cost,
            req.user.fullname,
            req.user._id
          );
          await taskModel.findByIdAndUpdate(
            { _id: taskID },
            { taskStatus: statusID }
          );
          res.json({ msg });
        } else {
          const msg = await confirmTaskB(
            taskID,
            freelancerID,
            cost,
            req.user.fullname,
            req.user._id
          );
          await taskModel.findByIdAndUpdate(
            { _id: taskID },
            { taskStatus: statusID }
          );
          res.json({ msg });
        }
      } else {
        await taskModel.findByIdAndUpdate(
          { _id: taskID },
          { taskStatus: statusID }
        );
        res.json({ msg: "Done" });
      }
    } else if (currentStatus.slug == "done" && role != "customerService") {
      await taskModel.findByIdAndUpdate(
        { _id: taskID },
        { taskStatus: statusID }
      );
      const date = new Date().toLocaleString("en-US", {
        timeZone: "Africa/Cairo",
      });
      await new noteModel({
        content: `${req.user.fullname} has set task ${taskSerial.serialNumber} to be done in ${date}`,
        user_id: req.user._id,
        task_id: taskID,
      }).save();
      const file = await pushFile(
        req.file.originalname,
        req.file.path,
        req.file.mimetype,
        fileSizeFormatter(req.file.size, 2),
        taskSerial.speciality,
        taskID
      );
      await taskModel.findByIdAndUpdate({ _id: taskID }, { file: file._id });
      res.json({ msg: "Task set to done successfully", file });
    } else if (
      currentStatus.slug == "delivered" &&
      role != "specialistService"
    ) {
      const msg = await deliverTask(taskID, req.user.fullname, req.user._id);
      await taskModel.findByIdAndUpdate(
        { _id: taskID },
        { taskStatus: statusID }
      );
      res.json({ msg });
    } else if (
      currentStatus.slug == "offer-submitted" &&
      role != "customerService"
    ) {
      const { freelancerID, cost, shareWith } = req.body;
      const checkAccepted = await taskModel.findOne({ _id: taskID });
      if (checkAccepted.accepted == false) {
        await acceptTask(taskID, req.user.fullname, req.user._id, shareWith);
      }
      const msg = await makeOffer(
        taskID,
        freelancerID,
        cost,
        req.user.fullname,
        req.user._id
      );
      await taskModel.findByIdAndUpdate(
        { _id: taskID },
        { taskStatus: statusID }
      );
      res.json({ msg });
    } else if (currentStatus.slug == "pending" && role != "specialistService") {
      await taskModel.findByIdAndUpdate(
        { _id: taskID },
        { taskStatus: statusID }
      );
      const date = new Date().toLocaleString("en-US", {
        timeZone: "Africa/Cairo",
      });
      await new noteModel({
        content: `${req.user.fullname} has set task ${taskSerial.serialNumber} to be pending in ${date}`,
        user_id: req.user._id,
        task_id: taskID,
      }).save();
      res.json({ msg: "Task set to pending successfully" });
    } else if (
      currentStatus.slug == "approved" &&
      role != "specialistService"
    ) {
      const { paid } = req.body;
      const msg = await confirmTaskA(
        taskID,
        paid,
        req.user._id,
        req.user.fullname
      );
      await taskModel.findByIdAndUpdate(
        { _id: taskID },
        { taskStatus: statusID }
      );
      res.json({ msg });
    } else if (
      currentStatus.slug == "rejected" &&
      role != "specialistService"
    ) {
      const msg = await refuseTask(taskID, req.user.fullname, req.user._id);
      await taskModel.findByIdAndUpdate(
        { _id: taskID },
        { taskStatus: statusID }
      );
      res.json({ msg });
    } else if (currentStatus.slug == "cancel") {
      const currentStatus = await taskModel.findOne({ _id: taskID });
      const currentStatusSlug = await statusModel.findOne({
        _id: currentStatus.taskStatus,
      });
      if (currentStatusSlug.slug == "delivered") {
        await editTask(taskID, req.user.fullname, req.user._id);
      }
      await taskModel.findByIdAndUpdate(
        { _id: taskID },
        { taskStatus: statusID }
      );
      const date = new Date().toLocaleString("en-US", {
        timeZone: "Africa/Cairo",
      });
      await new noteModel({
        content: `${req.user.fullname} has set task ${taskSerial.serialNumber} to be cancelled in ${date}`,
        user_id: req.user._id,
        task_id: taskID,
      }).save();
      res.json({ msg: "Task set to cancelled successfully" });
    } else if (currentStatus.slug == "edit") {
      const msg = await editTask(taskID, req.user.fullname, req.user._id);
      await taskModel.findByIdAndUpdate(
        { _id: taskID },
        { taskStatus: statusID }
      );
      res.json({ msg });
    } else {
      return next(
        new HttpError("You are not authorized to make this edit", 401)
      );
    }
  } catch (error) {
    return next(new HttpError(`Unexpected Error: ${error}`, 500));
  }
};

const updateTask = async (req, res, next) => {
  try {
    const role = req.user.user_role;
    const taskID = req.params.id;
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
      profit_percentage,
      profit_amount,
    } = req.body;
    if (role == "admin") {
      const theStatus = await taskModel.findOne({ _id: taskID });
      const getThisStatus = await statusModel.findOne({
        _id: theStatus.taskStatus,
      });
      if ((paid || cost) && getThisStatus.slug == "delivered") {
        await editTask(taskID, req.user.fullname, req.user._id);
        await taskModel.findByIdAndUpdate(
          { _id: taskID },
          {
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
            profit_percentage,
            profit_amount,
          }
        );
        const date = new Date().toLocaleString("en-US", {
          timeZone: "Africa/Cairo",
        });
        await new noteModel({
          content: `Admin: ${req.user.fullname} has updated this task in ${date}`,
          user_id: req.user._id,
          task_id: taskID,
        }).save();
        await deliverTask(taskID, req.user.fullname, req.user._id);
        res.json({ message: "Task has been updated successfully" });
      } else {
        await taskModel.findByIdAndUpdate(
          { _id: taskID },
          {
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
            profit_percentage,
            profit_amount,
          }
        );
        const date = new Date().toLocaleString("en-US", {
          timeZone: "Africa/Cairo",
        });
        await new noteModel({
          content: `Admin: ${req.user.fullname} has updated this task in ${date}`,
          user_id: req.user._id,
          task_id: taskID,
        }).save();
        res.json({ message: "Task has been updated successfully" });
      }
    } else {
      return next(
        new HttpError("You are not authorized to full update this task!", 401)
      );
    }
  } catch (error) {
    return next(new HttpError(`Unexpected Error: ${error}`, 500));
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const role = req.user.user_role;
    const taskID = req.params.id;
    if (role != "specialistService" && role != "freelancer") {
      const currentStatus = await taskModel.findOne({ _id: taskID });
      const currentStatusSlug = await statusModel.findOne({
        _id: currentStatus.taskStatus,
      });
      if (currentStatusSlug.slug == "delivered") {
        await deleteDeliveredTask(taskID);
      } else {
        await deleteNormalTask(taskID);
      }
      await taskModel.findByIdAndDelete({ _id: taskID });
      res.json({ message: "Task Has been deleted successfully" });
    } else {
      return next(
        new HttpError("You are not authorized to delete this task!", 401)
      );
    }
  } catch (error) {
    return next(new HttpError(`Unexpected Error: ${error}`, 500));
  }
};

const downloadFile = async (req, res, next) => {
  const found = await fileModel.find({ _id: req.params.id });
  if (found) {
    let file = __dirname + "../../../" + found[0].filePath;
    res.download(file);
  } else {
    return next(new HttpError("file not found", 404));
  }
};

module.exports = {
  getMyTasks,
  getTask,
  FilterTasks,
  FilterTasksA,
  FilterTasksB,
  createTask,
  partialUpdateTask,
  updateTask,
  deleteTask,
  downloadFile,
};
