const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

router.post("/create-project", projectController.createProject);
router.get("/projects", projectController.getAllProjects);
router.get("/projects/:id", projectController.getProject);
router.get("/projects/:id/completion-time", projectController.getProjectCompletionTime);
router.delete("/projects/:id/delete", projectController.deleteProject);

module.exports = router;
