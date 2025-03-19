import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./App.css";

function DropDown({ projectsData, selectedProject, setSelectedProject }) {
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    projectName: "",
    projectId: "",
    teamSize: "",
    budget: "",
    workload: "",
  });
  const [completionTime, setCompletionTime] = useState("-");

  const handleSelect = (project) => {
    setSelectedProject(project);
    setCompletionTime(project ? project.completionTime || "-" : "-");
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Project Details:", newProject);
    handleCloseModal();
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="dropdown" style={{ width: "90%" }}>
        <br />
        <div className="d-flex justify-content-between mb-3">
          <h5>
            Project Name:{" "}
            {selectedProject ? (
              selectedProject.projectName
            ) : (
              <Button onClick={handleShowModal} className="btn-custom">
                Add New Project
              </Button>
            )}
          </h5>
          <h5>
            Project ID: {selectedProject ? selectedProject.projectId : "-"}
          </h5>
          <h5>Team Size: {selectedProject ? selectedProject.teamSize : "-"}</h5>
          <h5>Budget: {selectedProject ? selectedProject.budget : "-"}</h5>
          <h5>Workload: {selectedProject ? selectedProject.workload : "-"}</h5>
          <h5>
            Completion Time:{" "}
            {selectedProject ? selectedProject.completionTime : "-"}
          </h5>
        </div>
        <br />
        <button
          className="btn btn-secondary dropdown-toggle w-100"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {selectedProject ? selectedProject.projectName : "Select Project"}
        </button>
        <ul
          className="dropdown-menu w-100"
          aria-labelledby="dropdownMenuButton"
        >
          <li>
            <a
              className="dropdown-item"
              href="#"
              onClick={() => handleSelect(null)}
            >
              -
            </a>
          </li>
          {projectsData.map((project, index) => (
            <li key={index}>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => handleSelect(project)}
              >
                {project.projectName}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formProjectName">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                name="projectName"
                value={newProject.projectName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formProjectId">
              <Form.Label>Project ID</Form.Label>
              <Form.Control
                type="text"
                name="projectId"
                value={newProject.projectId}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formTeamSize">
              <Form.Label>Team Size</Form.Label>
              <Form.Control
                type="number"
                name="teamSize"
                value={newProject.teamSize}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBudget">
              <Form.Label>Budget</Form.Label>
              <Form.Control
                type="number"
                name="budget"
                value={newProject.budget}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formWorkload">
              <Form.Label>Workload</Form.Label>
              <Form.Control
                type="text"
                name="workload"
                value={newProject.workload}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Project
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DropDown;
