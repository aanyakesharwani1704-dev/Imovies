# iMovies

iMovies is a MERN movie-ticket booking project. The backend provides JWT authentication, movie and theatre discovery, show scheduling, seat availability, and demo ticket bookings.

## Technology

- Frontend: React, Vite, Bootstrap, React Router, Axios, React Icons
- Backend: Node.js, Express, Mongoose, MongoDB Atlas, JWT, bcrypt

## Project Structure

```text
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  scripts/
  test/
  utils/
frontend/
  src/
```

## Backend Setup

Use Node.js 20.19+ or 22.12+ and a MongoDB Atlas cluster.

From PowerShell:

```powershell
cd backend
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm install
npm run dev
```

Edit `backend/.env` locally. Set `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, `PORT`, and `NODE_ENV`.

Never upload `.env` or share real credentials.

## Seed Data and Initial Admin

Run:

```powershell
npm run seed
```

This creates or retains sample movies, theatres, and showtimes.

## API Overview

All API paths are prefixed with `/api`.

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | API/database readiness |
| POST | `/auth/register` | Public | Register |
| POST | `/auth/login` | Public | Login |
| GET | `/auth/me` | User | Current user |
| GET | `/movies` | Public | Movie listing |
| GET | `/movies/:id` | Public | Movie details |
| GET | `/theatres` | Public | Theatre listing |
| GET | `/shows` | Public | Show listing |
| GET | `/shows/:id/seats` | Public | Seat availability |
| POST | `/bookings` | User | Book seats |
| GET | `/bookings/my-bookings` | User | Booking history |

## Tests

From the backend folder:

```powershell
npm test
```

## Frontend

From another PowerShell window:

```powershell
cd frontend
npm install
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm run dev
```

The frontend development server defaults to `http://localhost:5173`.

Validate the frontend:

```powershell
npm run build
npm run lint
```

## Deployment

Deploy the backend to Render or a compatible Node.js host, the frontend to Vercel, and MongoDB to Atlas.

Configure production environment variables in the hosting providers. Never upload `.env` files.