const express = require("express");
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/MongoDB_2");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB Error:", error);
  }
};
// Task Schema
const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  date: { type: String, required: true },
  completed: { type: Boolean, default: false },
});
const Task = mongoose.model("Task", taskSchema);

module.exports = { Task, connectDB };
