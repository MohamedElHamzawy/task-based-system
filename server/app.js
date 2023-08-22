const express = require("express");
const mongoose = require("mongoose");
const app = express();

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
    channelRoutes
} = require("./routes/allRoutes");

app.use("/api", loginRoutes);
app.use("/api/user", userRoutes);
app.use("/api/speciality", specialityRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/currency", currencyRoutes);
app.use("/api/channel", channelRoutes);

const port = 5000;
const server = app.listen(port, async () => {
    await mongoose.connect("mongodb+srv://mohamedfelhamzawy:01029505696@cluster0.zti9wu1.mongodb.net/", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log("DB conected")).then(() => console.log(`Running on port ${port} ...`));
});