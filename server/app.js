const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

const port = 5000;

const server = app.listen(port, async () => {
    await mongoose.connect("mongodb+srv://mohamedfelhamzawy:01029505696@cluster0.zti9wu1.mongodb.net/", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log("DB conected")).then(() => console.log(`Running on port ${port} ...`));
});