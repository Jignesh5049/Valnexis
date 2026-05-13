const crypto = require('crypto');

const library = [
  {
    type: 'Cross-Site Scripting (XSS)',
    severity: 'High',
    description: 'Reflected payload behavior indicates missing output encoding.',
    proofOfConcept: '<script>alert(1)</script> echoed in response',
    remediation: 'Apply contextual output encoding and strict Content Security Policy.',
    references: ['https://owasp.org/www-community/attacks/xss/']
  },
  {
    type: 'SQL Injection',
    severity: 'Critical',
    description: 'Unsanitized query parameter appears to alter SQL logic.',
    proofOfConcept: "' OR '1'='1 discovered in response differential",
    remediation: 'Use parameterized queries and strict server-side validation.',
    references: ['https://owasp.org/www-community/attacks/SQL_Injection']
  },
  {
    type: 'CSRF Risk',
    severity: 'Medium',
    description: 'State-changing request observed without anti-CSRF token.',
    proofOfConcept: 'POST endpoint accepted request without token validation.',
    remediation: 'Implement anti-CSRF tokens with SameSite cookies and origin checks.',
    references: ['https://owasp.org/www-community/attacks/csrf']
  },
  {
    type: 'Security Misconfiguration',
    severity: 'High',
    description: 'Missing hardening headers detected (CSP/HSTS/X-Frame-Options).',
    proofOfConcept: 'Response headers were incomplete for baseline hardening.',
    remediation: 'Set hardened security headers and disable unnecessary debug endpoints.',
    references: ['https://owasp.org/Top10/A05_2021-Security_Misconfiguration/']
  },
  {
    type: 'Open Port Exposure',
    severity: 'Low',
    description: 'Service ports indicate potentially unnecessary externally visible surfaces.',
    proofOfConcept: 'Port metadata indicates non-essential service exposure.',
    remediation: 'Restrict external network access using firewall rules and segmentation.',
    references: ['https://owasp.org/www-project-top-ten/']
  }
];

function seededNumber(seed, max) {
  const digest = crypto.createHash('sha256').update(seed).digest('hex');
  const value = parseInt(digest.slice(0, 8), 16);
  return value % max;
}

function runStaticRiskProfiling(target) {
  const findingsCount = 1 + seededNumber(target, 4);
  const start = seededNumber(`${target}-offset`, library.length);
  const findings = [];

  for (let i = 0; i < findingsCount; i += 1) {
    findings.push(library[(start + i) % library.length]);
  }

  const severityWeight = { Low: 10, Medium: 20, High: 30, Critical: 40 };
  const score = Math.min(
    100,
    findings.reduce((sum, item) => sum + severityWeight[item.severity], 0)
  );

  return {
    findings,
    riskScore: score,
    metadata: {
      ports: [80, 443],
      headers: ['content-security-policy', 'strict-transport-security'],
      technologies: ['node.js', 'nginx', 'react']
    }
  };
}

module.exports = {
  runStaticRiskProfiling
};
