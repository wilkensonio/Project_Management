import { useState } from "react";
import "./App.css";
import TaskCard from "./TaskCard";
import DropDown from "./DropDown";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import tasksData from "./MockData/tasks.json";
import projectsData from "./MockData/projects.json";

function App() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="body">
      <div className="d-flex justify-content-center align-items-center vh-100 vw-100">
        <div className="card" style={{ width: "90%", height: "90%" }}>
          <div className="card-body">
            <DropDown
              projectsData={projectsData}
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
            />
            <br />
            <br />
            <TaskCard tasksData={tasksData} selectedProject={selectedProject} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
