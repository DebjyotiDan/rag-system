const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      minlength: 8,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
      default: null,
    },

    refreshToken: {
    type: String,
    default: null
}

  },
  {
    timestamps: true,
  },
);

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: "15m",
        }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

module.exports = mongoose.model("User", userSchema);
