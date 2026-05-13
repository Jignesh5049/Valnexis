# Sample Test Data

## Seeded Credentials
Run:

```bash
cd backend
npm run seed
```

Then login with:
- Admin: `admin@valnexis.local` / `Admin@123456!`
- User: `analyst@valnexis.local` / `User@123456!`

## URL Targets For Testing
- `https://demo.example.com`
- `https://owasp.org`
- `https://testphp.vulnweb.com` (lab/demo target only)

## Upload Sample Ideas
- Small zip with sample JS or TS project
- JSON config snapshots

## API Test Snippets
Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Tester","email":"tester@example.com","password":"StrongPass@12345"}'
```

Queue URL scan:
```bash
curl -X POST http://localhost:5000/api/scans \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"targetType":"url","target":"https://example.com"}'
```
