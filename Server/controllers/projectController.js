const Project = require("../models/project");
const bodyParser = require("body-parser");
const { ObjectId } = require("mongodb"); 
const fetch = require("node-fetch");


exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 
 

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const result = await Project.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Project not found" });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 
 

exports.getProjectCompletionTime = async (req, res) => {
  const project = await Project.findById(req.params.id).populate('tasks');
  if (!project) return res.status(404).json({ error: "Project not found" });

  const sumDuration = project.tasks.reduce((sum, task) => sum + task.estimateDuration, 0); 
  const numberOfTasks = project.tasks.length;
  const projectData = {
    teamSize: project.teamSize,
    budget: project.budget,
    workload: project.workload,
    estimateDuration: sumDuration,
    tasks: numberOfTasks,
  }; 
 
  try {
    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error(`Flask API returned error: ${response.statusText}`);
    }

    const prediction = await response.json();
    console.log("Flask API response:", prediction);  

    res.json(prediction);  
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to get prediction from Flask API" });
  }
}; 
 

exports.updateProjectTask = async (req, res) => {
  const { projectId, taskId } = req.body; // Get the projectId and taskId from the URL parameters
 
  try {
    // Ensure that the projectId and taskId are valid MongoDB ObjectId
    if (!ObjectId.isValid(projectId) || !ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: "Invalid projectId or taskId" });
    } 
  
    // Find the project by ID
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Add taskId to the tasks array
    const update = {
      $push: {
        tasks: taskId,  
      },
    }; 
    
    const result = await Project.updateOne({ _id: projectId }, update);
    console.log(result, "johdfh") 
    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: "Failed to update project tasks" });
    }

    res.status(200).json({ message: "Task added successfully to the project" });
  } catch (error) {
    console.error("Error updating project task:", error);
    console.log(error, "kjdlkfsldhf")
    res.status(500).json({ error: "Internal server error" });
  }
};