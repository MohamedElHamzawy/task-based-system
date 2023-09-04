const express = require("express");
const mongoose = require("mongoose");
const app = express();
const HttpError = require("./common/httpError");

require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const {
    loginRoutes,
    userRoutes,
    specialityRoutes,
    clientRoutes,
    statusRoutes,
    currencyRoutes,
    freelancerRoutes,
    accountRoutes,
    taskRoutes,
    transactionRoutes,
    commentRoutes
} = require("./routes/allRoutes");

app.use("/api", loginRoutes);
app.use("/api/user", userRoutes);
app.use("/api/speciality", specialityRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/currency", currencyRoutes);
app.use("/api/freelancer", freelancerRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/comment", commentRoutes);
app.use((req,res,next) => {
    return next(new HttpError("Route Not Found", 404));
});
app.use((error,req,res,next) => {
    res.status(error.code || 500).json({err: error.message || "Something went wrong!"});
})
const port = parseInt(process.env.PORT);
const server = app.listen(port, async () => {
    try {
        await mongoose.connect(process.env.CON_LINK, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => console.log("DB conected")).then(() => console.log(`Running on port ${port} ...`));
    } catch (error) {
        return next(new HttpError(`Unexpected Error: ${error}`, 500));
    }
});