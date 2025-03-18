import "./App.css";

function TaskCard() {
  return (
    <>
      <div className="task-cards-container">
        <div className="task-card">
          <h4>Title: Task 1</h4>
          <h4>Due Date: </h4>
          <h4>Assignee: </h4>
          <h4>Status: </h4>
        </div>
        <div className="task-card">
          <h4>Title: Task 2</h4>
          <h4>Due Date: </h4>
          <h4>Assignee: </h4>
          <h4>Status: </h4>
        </div>
        <div className="task-card">
          <h4>Title: Task 3</h4>
          <h4>Due Date: </h4>
          <h4>Assignee: </h4>
          <h4>Status: </h4>
        </div>
        {/* Add more task cards as needed */}
      </div>
      <div className="desc-card">
        <h3>Description: </h3>
        <p>Hello</p>
      </div>
    </>
  );
}

export default TaskCard;
