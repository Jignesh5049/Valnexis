const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({ notifications });
});

const markNotificationRead = asyncHandler(async (req, res) => {
  await Notification.updateOne(
    { _id: req.params.id, userId: req.user.id },
    { $set: { isRead: true } }
  );
  res.status(204).send();
});

module.exports = {
  getNotifications,
  markNotificationRead
};
