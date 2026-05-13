# Valnexis API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### POST /auth/register
Creates a new user account.

Request JSON:
```json
{
  "name": "Security Analyst",
  "email": "analyst@example.com",
  "password": "StrongPassword@123"
}
```

Response JSON:
```json
{
  "user": {
    "id": "...",
    "name": "Security Analyst",
    "email": "analyst@example.com",
    "role": "user"
  },
  "accessToken": "...",
  "refreshToken": "..."
}
```

### POST /auth/login
Logs user in and returns access/refresh token pair.

### POST /auth/refresh
Rotates and returns new access/refresh token pair.

### POST /auth/logout
Invalidates refresh token for authenticated user.

### GET /auth/me
Returns current authenticated user profile.

## Scans

### POST /scans
Queues a scan.

For URL scan:
```json
{
  "targetType": "url",
  "target": "https://example.com"
}
```

For upload scan: multipart/form-data with fields:
- `targetType=upload`
- `target` optional name
- `project` file

### GET /scans
Returns last 100 scans for authenticated user.

### GET /scans/:id
Returns one scan by ID for authenticated user.

## Reports

### GET /reports/:id/pdf
Downloads PDF scan report.

## Notifications

### GET /notifications
Returns last 50 notifications.

### PATCH /notifications/:id/read
Marks notification as read.

## Admin (RBAC: admin only)

### GET /admin/summary
Returns user and scan stats plus recent scan list.

## Security Controls
- JWT access + rotating refresh tokens
- Password hashing (bcrypt)
- Rate limiting for auth and API endpoints
- Input validation via express-validator
- SSRF guard rails for URL scans
- Helmet, HPP, NoSQL injection and XSS sanitization middleware
- Role-based authorization
- Audit and error logging
