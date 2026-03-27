# Best Infra Consumer Mobile System Test Project

This repository contains:

- Expo React Native mobile app in the repo root
- Node.js + Express + MySQL backend in `backend/`

## Requirement Traceability

The implementation aligns with the system test guide:

- Splash shown on cold launch for ~2.4 seconds, then routing by auth + onboarding state
- Onboarding with swipe slides, pagination, Next, and Login actions
- Login and Register integrated with backend APIs
- Dashboard with consumer details, energy summary, usage graph filters (`7D`, `30D`, `90D`, `1Y`), and alerts table
- Profile (`GET /api/profile`, `PUT /api/profile`)
- Settings with dark mode and logout
- Notifications list with required categories:
  - `BILL_DUE`
  - `PAYMENT_CONFIRMATION`
  - `LOW_BALANCE`
  - `SYSTEM_ALERT`
  - `TICKET_UPDATE`
- Backend structure in `backend/src` with `controllers`, `routes`, `models`, `services`, `middleware`, and `config`
- APK build workflow via Expo EAS

## Local Setup

### Mobile app

1. Install dependencies:
   - `npm install`
2. Configure mobile env:
   - Copy `.env.example` to `.env`
   - Set `EXPO_PUBLIC_API_BASE_URL` when needed (physical device should use your machine LAN IP)
   - If backend is not on `5000`, set `EXPO_PUBLIC_API_PORT` or full `EXPO_PUBLIC_API_BASE_URL`
3. Start app:
   - `npm run start`
4. Optional Android launch:
   - `npm run android`

### Backend

1. Install backend dependencies:
   - `npm --prefix backend install`
2. Configure backend env:
   - Copy `backend/.env.example` to `backend/.env`
3. Create database schema:
   - Run SQL in `backend/db/schema.sql`
4. Optional sample data:
   - Run SQL in `backend/db/seed.sql`
5. Start backend:
   - `npm run backend:dev`

## API Contract

Base path: `/api`

- `POST /register`
- `POST /login`
- `GET /dashboard` (Bearer token)
  - Query param: `range=7D|30D|90D|1Y` (optional, default `30D`)
  - Invalid values return `400` with validation message
- `GET /profile` (Bearer token)
- `PUT /profile` (Bearer token)
- `GET /notifications` (Bearer token)

## Render Deployment (External MySQL)

Use this when producing the hosted backend URL deliverable.

1. Provision an external MySQL database (for example, PlanetScale, Aiven, Railway MySQL, or another managed MySQL provider).
2. In Render, create a new **Web Service** from this repository.
3. Configure service:
   - Runtime: `Node`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm run start`
4. Configure environment variables in Render:
   - `PORT` (Render sets this automatically; app reads it)
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN` (example: `7d`)
   - `CLIENT_ORIGIN` (example: `*` or your frontend origin)
5. Apply `backend/db/schema.sql` to the hosted MySQL instance.
6. Optional: apply `backend/db/seed.sql`.
7. After deploy, verify:
   - `https://<your-render-service>/health`
   - `https://<your-render-service>/api/dashboard` (with Bearer token)
8. Set mobile `.env`:
   - `EXPO_PUBLIC_API_BASE_URL=https://<your-render-service>/api`

## Testing

- Backend test suite:
  - `npm --prefix backend test`

## APK Build

For Android APK output:

- `eas build -p android --profile preview`

`eas.json` is configured so `preview` builds an APK (`buildType: apk`).

## Final Submission Checklist

1. Mobile app source code (this repository root)
2. Backend source code (`backend/`)
3. Hosted backend URL (public Render URL)
4. Database schema (`backend/db/schema.sql`)
5. APK file generated from EAS build
