const Roles = Object.freeze({
  USER: 'user',
  ADMIN: 'admin'
});

const ScanStatuses = Object.freeze({
  QUEUED: 'queued',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed'
});

const Severities = Object.freeze(['Low', 'Medium', 'High', 'Critical']);

module.exports = {
  Roles,
  ScanStatuses,
  Severities
};
