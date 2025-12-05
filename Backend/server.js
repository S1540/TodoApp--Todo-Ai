const taskRoutes = require("./routes/taskRoutes");
const { Task, connectDB } = require("./db");
const express = require("express");
const cors = require("cors");
const { model } = require("mongoose");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use("/", taskRoutes);
connectDB();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
