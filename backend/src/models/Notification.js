const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: { type: String, required: true, maxlength: 120 },
    message: { type: String, required: true, maxlength: 600 },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'critical'],
      default: 'info'
    },
    isRead: { type: Boolean, default: false },
    scanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scan'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
