const express = require("express");
const passport = require("passport");
const {
  registerController,
  loginController,
} = require("../controllers/authController");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/userModel");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

// Get current user info (protected)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -refreshToken");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",

  passport.authenticate("google", {
    session: false,
  }),

  async (req, res) => {

    try {

      const token = jwt.sign(
        {
          id: req.user._id,
          email: req.user.email,
        },

        process.env.JWT_key,

        {
          expiresIn: "7d",
        },
      );

      const userInfo = encodeURIComponent(JSON.stringify({
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
      }));

      res.redirect(
        `http://localhost:5173/dashboard?token=${token}&user=${userInfo}`
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: "OAuth login failed",
      });
    }
  },
);
module.exports = router;
