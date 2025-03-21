const express = require("express");
const mongoose = require("mongoose");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes")
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/pmdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api", projectRoutes);
app.use("/api", taskRoutes);

app.use(require("./middleware/errorHandler"));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
