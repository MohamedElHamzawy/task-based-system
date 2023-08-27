const loginRoutes = require("../modules/login/login.routes");
const userRoutes = require("../modules/user/user.routes");
const specialityRoutes = require("../modules/speciality/speciality.routes");
const clientRoutes = require("../modules/client/client.routes");
const statusRoutes = require("../modules/status/status.routes");
const currencyRoutes = require("../modules/currency/currency.routes");
const freelancerRoutes = require("../modules/freelancer/freelancer.routes");
const accountRoutes = require("../modules/account/account.routes");
const taskRoutes = require("../modules/task/task.routes");
const transactionRoutes = require("../modules/transaction/transaction.routes");

module.exports = {
    loginRoutes,
    userRoutes,
    specialityRoutes,
    clientRoutes,
    statusRoutes,
    currencyRoutes,
    freelancerRoutes,
    accountRoutes,
    taskRoutes,
    transactionRoutes
}