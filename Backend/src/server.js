const express = require("express");
const connectDB = require("./connection/db");

const app = express();
connectDB();

app.get("/", (req, res) => res.send("Hello World"));

const PORT = (process.env.PORT = 3333);

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
