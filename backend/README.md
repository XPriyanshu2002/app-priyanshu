# Best Infra Backend

Node.js + Express + MySQL API for the Best Infra consumer mobile app.

## Local Run

1. Install dependencies:
   - `npm install`
2. Configure environment:
   - Copy `.env.example` to `.env`
3. Initialize database:
   - Run `npm run db:migrate`
4. Optional seed:
   - Run `npm run db:seed`
5. Start development server:
   - `npm run dev`

## Environment Variables

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_ORIGIN`

## API Endpoints

- `POST /api/register`
- `POST /api/login`
- `GET /api/dashboard` (Bearer token)
  - Optional query param `range=7D|30D|90D|1Y` (default: `30D`)
  - Invalid range returns `400`
- `GET /api/profile` (Bearer token)
- `PUT /api/profile` (Bearer token)
- `GET /api/notifications` (Bearer token)

## Tests

- `npm test`
