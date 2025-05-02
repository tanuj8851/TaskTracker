const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const { protect } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project for the logged-in user
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Project Alpha
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Project limit reached or invalid input
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects for the logged-in user
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of the user's projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   user:
 *                     type: string
 *                   tasks:
 *                     type: array
 *                     items:
 *                       type: object
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, async (req, res) => {
  const projects = await Project.find({ user: req.user._id }).populate("tasks");
  res.json(projects);
});

module.exports = router;
