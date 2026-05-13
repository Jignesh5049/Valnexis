# Security Notes

Valnexis is built with a security-first baseline and should still undergo regular auditing.

## Implemented Hardening
- Password hashing using bcrypt with configurable salt rounds
- Access and refresh token model with refresh token hashing and rotation
- Route-level RBAC for admin-only endpoints
- Rate limiting for brute-force and API abuse mitigation
- Input validation and sanitization on request payloads
- Basic SSRF target filtering for blocked hostnames/private ranges
- Helmet headers and payload hardening middleware
- Strict file upload extension and size checks
- Structured logging for audit and incident review

## Operational Security Recommendations
- Deploy behind TLS termination and enforce HTTPS redirect
- Store secrets in secure secret manager (not .env in prod)
- Add WAF and bot mitigation at edge
- Add SAST + DAST + dependency scanning in CI pipeline
- Centralize logs and configure alerting for suspicious patterns
- Add MFA for admin users
- Implement secure backup and key rotation policy

## Important Disclaimer
The included scanner service is a safe simulation/profile engine for development and UX. For real production-grade active scanning, integrate vetted tools such as OWASP ZAP in isolated worker infrastructure with strict sandboxing and legal authorization controls.
