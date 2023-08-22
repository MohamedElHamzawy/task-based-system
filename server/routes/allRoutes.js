const loginRoutes = require("../modules/login/login.routes");
const userRoutes = require("../modules/user/user.routes");
const specialityRoutes = require("../modules/speciality/speciality.routes");
const clientRoutes = require("../modules/client/client.routes");
const statusRoutes = require("../modules/status/status.routes");
const currencyRoutes = require("../modules/currency/currency.routes");
const channelRoutes = require("../modules/channel/channel.routes");

module.exports = {
    loginRoutes,
    userRoutes,
    specialityRoutes,
    clientRoutes,
    statusRoutes,
    currencyRoutes,
    channelRoutes
}