const User = require("../models/User");
const { generateToken, sendToken } = require("../utils/manageToken");

// @desc    Register new user
const registerUser = async (req, res) => {
  const { name, country, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ name, country, email, password });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

// @desc    Authenticate user & get token
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate user
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  sendToken(user, 200, res);
};

// Logout Controller
const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ message: "Logged Out" });
};

module.exports = { registerUser, loginUser, logoutUser };
