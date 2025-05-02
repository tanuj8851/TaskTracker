const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, (req, res) => {
  return res.status(200).json({ user: req.user });
});

module.exports = router;
