const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true, unique: true },
  projectId: { type: String, required: true },
  teamSize: { type: Number, required: true },
  budget: { type: Number },
  workload: {
    type: String,
    enum: ["light", "medium", "heavy"],
    default: "light",
  },
  completionTime: { type: Number, default: 0},
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "task" }],
});

module.exports = mongoose.model("project", projectSchema);
  