const express = require("express");
const connectDB = require("./connection/db");

const authRoute = require("./routes/auth.routes");
const userRoute = require("./routes/users.routes");
const profileRoute = require("./routes/profile.routes");
const postsRoute = require("./routes/posts.routes");

const app = express();
connectDB();

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/posts", postsRoute);

const PORT = (process.env.PORT = 3333);

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
