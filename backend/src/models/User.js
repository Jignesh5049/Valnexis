const mongoose = require('mongoose');
const { Roles } = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: Object.values(Roles),
      default: Roles.USER
    },
    refreshTokenHash: {
      type: String,
      select: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLoginAt: Date
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
