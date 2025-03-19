const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

 
router.get("/tasks", taskController.getAllTasks); 
router.get("/tasks/:id", taskController.getTaskById); 
router.post("/tasks/create-task", taskController.createTask); 
router.delete("/tasks/:id/delete", taskController.deleteTaskById); 
router.patch("/tasks/:id/status/update", taskController.updateTaskStatus);

module.exports = router;
