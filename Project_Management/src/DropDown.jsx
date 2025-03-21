import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./App.css";

const url = "http://localhost:3000/api";

function DropDown({ selectedProject, setSelectedProject }) {
  const [projectsData, setProjectsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    projectName: "",
    projectId: "",
    teamSize: "",
    budget: "",
    workload: "",
    tasks: [],
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${url}/projects`);
        const data = await response.json();
        setProjectsData(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleSelect = (project) => {
    setSelectedProject(project);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${url}/projects/create-project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        const createdProject = await response.json();
        setProjectsData([...projectsData, createdProject]);

        const completionTime = await fetchCompletionTime(createdProject._id);

        await updateCompletionTime(createdProject._id, completionTime);

        setSelectedProject({ ...createdProject, completionTime });
      } else {
        console.error("Failed to create project:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
    handleCloseModal();
  };

  const fetchCompletionTime = async (_id) => {
    try {
      const response = await fetch(`${url}/projects/${_id}/completion-time`);
      if (response.ok) {
        const data = await response.json();
        return data.predictedCompletionTimeHour;
      } else {
        console.error("Failed to fetch completion time:", response.statusText);
        return "-";
      }
    } catch (error) {
      console.error("Error fetching completion time:", error);
      return "-";
    }
  };

  const updateCompletionTime = async (projectId, completionTime) => {
    try {
      const response = await fetch(`${url}/projects/update/completion-time`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          completionTime,
        }),
      });

      if (!response.ok) {
        console.error("Failed to update completion time:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating completion time:", error);
    }
  };

  function formatMoney(amount, currency = "USD", locale = "en-US") {
    return amount.toLocaleString(locale, {
      style: "currency",
      currency: currency,
    });
  }

  // Usage
  console.log(formatMoney(123456.789)); // Output: $123,456.79
  console.log(formatMoney(123456.789, "EUR")); // Output: €123,456.79
  console.log(formatMoney(123456.789, "JPY", "ja-JP")); // Output: ￥123,457

  return (
    <div className="d-flex justify-content-center">
      <div className="dropdown-container">
        <br />
        <div className="d-flex justify-content-between mb-3">
          <h5>
            Project Name: {selectedProject ? selectedProject.projectName : "-"}
          </h5>
          <h5>
            Project ID:{" "}
            {selectedProject ? selectedProject.projectId.slice(-5) : "-"}
          </h5>
          <h5>Team Size: {selectedProject ? selectedProject.teamSize : "-"}</h5>
          <h5>
            Budget: {selectedProject ? `${formatMoney(selectedProject.budget)}` : "-"}
          </h5>
          <h5>Workload: {selectedProject ? selectedProject.workload : "-"}</h5>
          <h5>
            Completion Time/Hours:{" "}
            {selectedProject ? selectedProject.completionTime : "-"}
          </h5>
        </div>
        <br />
        <div className="d-flex">
          <div className="dropdown-content">
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
                  - No Selection -
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
          <Button
            onClick={handleShowModal}
            className="btn-custom button-container"
          >
            Add New Project
          </Button>
        </div>
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
                as="select"
                name="workload"
                value={newProject.workload}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Workload</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="heavy">Heavy</option>
              </Form.Control>
            </Form.Group>
            <br />
            <Button variant="custom" type="submit" className="btn-custom">
              Save Project
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DropDown;
