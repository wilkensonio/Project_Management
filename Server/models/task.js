const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: {
    type: String,
    default: "No description yet, add a description for this task.",
  },
  status: {
    type: String,
    enum: ["todo", "in-progress", "completed"],
    default: "todo",
  },
  assignTo: { type: String, default: "Not assigned" },
  dueDate: { type: Date },
  estimateDuration: { type: Number },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
    required: true,
  },
});

module.exports = mongoose.model("task", taskSchema);