const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const { protect } = require("../middlewares/authMiddleware");

// Create a project
router.post("/", protect, async (req, res) => {
  const { name } = req.body;
  const projectCount = await Project.countDocuments({ user: req.user._id });

  if (projectCount >= 4) {
    return res
      .status(400)
      .json({ message: "You can only have up to 4 projects" });
  }

  const project = await Project.create({ name, user: req.user._id });
  res.status(201).json(project);
});

// Get all projects for a user
router.get("/", protect, async (req, res) => {
  const projects = await Project.find({ user: req.user._id }).populate("tasks");
  res.json(projects);
});

module.exports = router;
