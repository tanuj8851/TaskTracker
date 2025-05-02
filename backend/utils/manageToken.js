const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
// Send token in cookies
const sendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);

  // Options for cookie
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        country: user.country,
      },
    });
};

module.exports = { generateToken, sendToken };
