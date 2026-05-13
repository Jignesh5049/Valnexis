const mongoose = require('mongoose');
const connectDb = require('../config/db');
const User = require('../models/User');
const Scan = require('../models/Scan');
const Notification = require('../models/Notification');
const { hashPassword } = require('../services/authService');
const { Roles } = require('../utils/constants');

async function seed() {
  await connectDb();

  await Promise.all([
    User.deleteMany({}),
    Scan.deleteMany({}),
    Notification.deleteMany({})
  ]);

  const [adminPasswordHash, userPasswordHash] = await Promise.all([
    hashPassword('Admin@123456!'),
    hashPassword('User@123456!')
  ]);

  const [admin, user] = await User.create([
    {
      name: 'Valnexis Admin',
      email: 'admin@valnexis.local',
      passwordHash: adminPasswordHash,
      role: Roles.ADMIN
    },
    {
      name: 'Security Analyst',
      email: 'analyst@valnexis.local',
      passwordHash: userPasswordHash,
      role: Roles.USER
    }
  ]);

  const scan = await Scan.create({
    userId: user._id,
    targetType: 'url',
    target: 'https://demo.example.com',
    status: 'completed',
    riskScore: 74,
    vulnerabilities: [
      {
        type: 'SQL Injection',
        severity: 'Critical',
        description: 'Dynamic query construction found in authentication endpoint.',
        proofOfConcept: "' OR '1'='1",
        remediation: 'Use parameterized queries and input whitelisting.',
        references: ['https://owasp.org/www-community/attacks/SQL_Injection']
      }
    ],
    metadata: {
      ports: [80, 443],
      headers: ['content-security-policy'],
      technologies: ['node.js', 'postgresql']
    },
    startedAt: new Date(Date.now() - 120000),
    completedAt: new Date()
  });

  await Notification.create({
    userId: user._id,
    scanId: scan._id,
    title: 'Seed scan report ready',
    message: 'Your seeded vulnerability scan report is available.',
    type: 'success'
  });

  console.log('Sample seed complete.');
  await mongoose.connection.close();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
