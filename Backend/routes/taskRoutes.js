require("dotenv").config();
const Groq = require("groq-sdk");
const express = require("express");
const router = express.Router();
const { Task } = require("../db");
const { model } = require("mongoose");

// get all userTask
router.get("/api/get-task", async (req, res) => {
  try {
    const response = await Task.find();
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Add User Task
router.post("/api/add-task", async (req, res) => {
  try {
    const { task, date } = req.body;
    console.log(req.body);

    const newTask = await Task.create({ task, date });
    res.json({
      success: true,
      message: "Task added successfully",
      data: newTask,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Delete User Task

router.delete("/api/delete-task/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });

    // console.log(`error is ${error}`);
  }
});

// Edit/Update User Task
router.put("/api/edit-task/:id", async (req, res) => {
  const id = req.params.id;
  const { task, date } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { task, date },
      { new: true }
    );
    // console.log({ updatedTask });
    res.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Todo AI Agent
const client = new Groq({
  apikey: process.env.GROQ_API_KEY,
});
router.post("/api/todo-ai/llama-3.3-70b-versatile", async (req, res) => {
  const messages = req.body.messages;
  const systemPrompt = {
    role: "system",
    content:
      "I am Shuzen-Z — your intelligent task companion, I was created by Shubham and the Shuzen-Z team is designed to organize your day with clarity and speed ",
  };

  try {
    const response = await client.chat.completions.create({
      temperature: 0.6,
      model: "llama-3.3-70b-versatile",
      messages: [systemPrompt, ...messages],
    });

    res.json({
      success: true,
      message: "AI Response Successfully",
      data: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI request error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
