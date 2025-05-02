const Project = require("../models/Project");
const Task = require("../models/Task");

// Create a task under project
const createTask = async (req, res) => {
  const { projectId } = req.params;
  const { title, description } = req.body;

  const project = await Project.findById(projectId);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (project.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const task = await Task.create({ title, description, project: projectId });
  project.tasks.push(task._id);
  await project.save();

  res
    .status(201)
    .json({ message: `${task.title} created successfully.`, task });
};

// Get all tasks under a project
const getTasks = async (req, res) => {
  const { projectId } = req.params;

  const tasks = await Task.find({ project: projectId });
  res.json(tasks);
};

// Update a task
const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status } = req.body;

  const task = await Task.findById(taskId);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.title = title || task.title;
  task.description = description || task.description;
  task.status = status || task.status;
  if (status === "completed") {
    task.completedAt = Date.now();
  }

  const updatedTask = await task.save();
  res.json(updatedTask);
};

// Delete a task
const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  await Task.deleteOne({ _id: taskId });
  res.json({ message: "Task removed" });
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
