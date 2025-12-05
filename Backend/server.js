require("dotenv").config();
const taskRoutes = require("./routes/taskRoutes");
const { Task, connectDB } = require("./db");
const express = require("express");
const cors = require("cors");
const path = require("path");
const { model } = require("mongoose");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());
app.use("/", taskRoutes);
connectDB();
// app.use(express.static(path.join(__dirname, "../dist")));
// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../dist/index.html"));
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
