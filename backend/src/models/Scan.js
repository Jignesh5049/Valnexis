const mongoose = require('mongoose');
const { ScanStatuses, Severities } = require('../utils/constants');

const vulnerabilitySchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    severity: { type: String, enum: Severities, required: true },
    description: { type: String, required: true },
    proofOfConcept: { type: String, default: '' },
    remediation: { type: String, required: true },
    references: [{ type: String }]
  },
  { _id: false }
);

const scanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    targetType: {
      type: String,
      enum: ['url', 'upload'],
      required: true
    },
    target: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2048
    },
    status: {
      type: String,
      enum: Object.values(ScanStatuses),
      default: ScanStatuses.QUEUED,
      index: true
    },
    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    vulnerabilities: [vulnerabilitySchema],
    startedAt: Date,
    completedAt: Date,
    failureReason: String,
    metadata: {
      ports: [Number],
      headers: [String],
      technologies: [String]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Scan', scanSchema);
