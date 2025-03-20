import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const url = "http://localhost:3000/api";

function TaskCard({ selectedProject }) {
  const [tasksData, setTasksData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    assignTo: "",
    status: "",
    estimateDuration: "",
    description: "",
    project: selectedProject ? selectedProject._id : "",
  });
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [taskId, setTaskId] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${url}/tasks`);
        const data = await response.json();
        setTasksData(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    setSelectedTask(null);
    setNewTask((prevTask) => ({
      ...prevTask,
      project: selectedProject ? selectedProject._id : "",
    }));
    setProjectId(selectedProject ? selectedProject._id : "");
  }, [selectedProject]);

  const filteredTasks = selectedProject
    ? tasksData.filter((task) => task.project === selectedProject._id)
    : [];

  const handleCardClick = (task) => {
    setSelectedTask(task);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const createTask = async () => {
      try {
        const taskResponse = await fetch(`${url}/tasks/create-task`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        });

        if (taskResponse.ok) {
          const createdTask = await taskResponse.json();
          setTasksData([...tasksData, createdTask]);
          setTaskId(createdTask._id);

          const projectTaskUrl = `${url}/projects/update/project`;
          const updateResponse = await fetch(projectTaskUrl, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              taskId: createdTask._id,
              projectId: projectId,
            }),
          });

          if (!updateResponse.ok) {
            console.error(
              "Failed to update project with task:",
              updateResponse.statusText
            );
          }
        } else {
          console.error("Failed to create task:", taskResponse.statusText);
        }
      } catch (error) {
        console.error("Error creating task or updating project:", error);
      }
      handleCloseModal();
    };

    createTask();
  };

  const getAlertColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "todo":
        return "secondary";
      case "in-progress":
        return "warning";
      default:
        return "light";
    }
  };

  const handleStatusChange = (task, newStatus) => {
    const updateStatus = async () => {
      try {
        const response = await fetch(`${url}/tasks/${task._id}/status/update`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
          const updatedTask = await response.json();
          setTasksData((prevTasks) =>
            prevTasks.map((t) => (t._id === updatedTask._id ? updatedTask : t))
          );
        } else {
          console.error("Failed to update task status:", response.statusText);
        }
      } catch (error) {
        console.error("Error updating task status:", error);
      }
      setIsEditingStatus(false);
    };

    updateStatus();
  };

  return (
    <>
      {!selectedProject ? (
        <div
          className="container d-flex justify-content-center align-items-center"
          style={{  paddingTop: "150px" }}
        >
          <img src="/assets/Travelers-Logo.png" alt="" />
        </div>
      ) : (
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
              {selectedProject && (
                <>
                  <Button
                    onClick={handleShowModal}
                    className="btn-custom mb-3 w-100"
                  >
                    Add New Task
                  </Button>
                  {filteredTasks.length > 0 ? (
                    filteredTasks.reverse().map((task, index) => (
                      <div
                        key={task._id || index}
                        className="card mb-4"
                        style={{ cursor: "pointer", position: "relative" }}
                        onClick={() => handleCardClick(task)}
                      >
                        <div className="d-flex align-items-center">
                          <div
                            className="card-body"
                            style={{ textAlign: "left", flex: 1 }}
                          >
                            <h4 className="card-title">Title: {task.title}</h4>
                            <h5 className="card-subtitle mb-2 text-muted">
                              Due Date:{" "}
                              {new Date(task.dueDate).toLocaleDateString()}
                            </h5>
                            <h5 className="card-subtitle mb-2 text-muted">
                              Assignee: {task.assignTo}
                            </h5>
                            <h5 className="card-subtitle mb-2 text-muted">
                              Status:{" "}
                              {isEditingStatus && selectedTask === task ? (
                                <Form.Control
                                  as="select"
                                  value={task.status}
                                  onChange={(e) =>
                                    handleStatusChange(task, e.target.value)
                                  }
                                  onBlur={() => setIsEditingStatus(false)}
                                  style={{
                                    width: "200px",
                                    display: "inline-block",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  <option value="todo">To Do</option>
                                  <option value="in-progress">
                                    In-Progress
                                  </option>
                                  <option value="completed">Completed</option>
                                </Form.Control>
                              ) : (
                                <span
                                  onClick={() => {
                                    setSelectedTask(task);
                                    setIsEditingStatus(true);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  {task.status}
                                </span>
                              )}
                            </h5>
                            <h5 className="card-subtitle mb-2 text-muted">
                              Estimated Duration: {task.estimateDuration} hours
                            </h5>
                          </div>
                          <div
                            className={`alert alert-${getAlertColor(
                              task.status
                            )}`}
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              marginLeft: "10px",
                              marginRight: "50px",
                            }}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="center-text">
                      <p>No tasks available for this project.</p>
                    </div>
                  )}
                </>
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
                      <p className="card-text">click status to change</p>
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
                <Form.Group controlId="formAssignTo">
                  <Form.Label>Assignee</Form.Label>
                  <Form.Control
                    type="text"
                    name="assignTo"
                    value={newTask.assignTo}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formStatus">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    name="status"
                    value={newTask.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="completed">Completed</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formEstimateDuration">
                  <Form.Label>Estimated Duration (hours)</Form.Label>
                  <Form.Control
                    type="number"
                    name="estimateDuration"
                    value={newTask.estimateDuration}
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
                    rows={2}
                  />
                </Form.Group>
                <br />
                <Button variant="custom" type="submit" className="btn-custom">
                  Save Task
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      )}
      {/* added above */}
    </>
  );
}

export default TaskCard;
