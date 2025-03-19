import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function TaskCard({ tasksData, selectedProject }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    assignee: "",
    status: "",
    estTime: "",
    description: "",
  });

  const handleCardClick = (task) => {
    setSelectedTask(task);
  };

  // Clear the selected task when a new project is selected
  useEffect(() => {
    setSelectedTask(null);
  }, [selectedProject]);

  // Filter tasks based on the selected project's ID
  const filteredTasks = selectedProject
    ? tasksData.filter((task) => task.projectId === selectedProject.projectId)
    : []; // Return an empty array if no project is selected

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Task Details:", newTask);
    handleCloseModal();
  };

  return (
    <div className="container-fluid">
      <div className="row no-gutters">
        <div
          className="col-md-7"
          style={{
            paddingLeft: "80px",
            maxHeight: "600px",
            overflowY: "auto",
          }}
        >
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <div
                key={index}
                className="card mb-4"
                style={{ cursor: "pointer" }}
                onClick={() => handleCardClick(task)}
              >
                <div className="card-body">
                  <h4 className="card-title">Title: {task.title}</h4>
                  <h5 className="card-subtitle mb-2 text-muted">
                    Due Date: {task.dueDate}
                  </h5>
                  <h5 className="card-subtitle mb-2 text-muted">
                    Assignee: {task.assignee}
                  </h5>
                  <h5 className="card-subtitle mb-2 text-muted">
                    Status: {task.status}
                  </h5>
                  <h5 className="card-subtitle mb-2 text-muted">
                    Estimated Time: {task.estTime}
                  </h5>
                </div>
              </div>
            ))
          ) : (
            <Button onClick={handleShowModal} className="btn-custom">
              Add New Task
            </Button>
          )}
        </div>
        <div
          className="col-md-5"
          style={{
            paddingRight: "80px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="card"
            style={{ flex: 1, width: "100%", minHeight: "585px" }}
          >
            <div className="card-body" style={{ textAlign: "center" }}>
              {selectedTask ? (
                <>
                  <h3 className="card-title">{selectedTask.title}</h3>
                  <h4 className="card-title">Description:</h4>
                  <p className="card-text">{selectedTask.description}</p>
                </>
              ) : (
                <h3 className="card-title">Task Details</h3>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTaskTitle">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDueDate">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAssignee">
              <Form.Label>Assignee</Form.Label>
              <Form.Control
                type="text"
                name="assignee"
                value={newTask.assignee}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                name="status"
                value={newTask.status}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEstTime">
              <Form.Label>Estimated Time</Form.Label>
              <Form.Control
                type="text"
                name="estTime"
                value={newTask.estTime}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Task
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TaskCard;
