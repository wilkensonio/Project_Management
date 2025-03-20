const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

router.post("/projects/create-project", projectController.createProject);
router.get("/projects", projectController.getAllProjects);
router.get("/project/:id", projectController.getProject);
router.delete("/project/:id/delete", projectController.deleteProject);

module.exports = router;
