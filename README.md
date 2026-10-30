# iMovies

iMovies is a MERN movie-ticket booking project. The backend provides JWT authentication, movie and theatre discovery, show scheduling, seat availability, and demo ticket bookings.

## Technology

- Frontend: React, Vite, Bootstrap, React Router, Axios, React Icons
- Backend: Node.js, Express, Mongoose, MongoDB Atlas, JWT, bcrypt

## Project Structure

```text
backend/
  config/       MongoDB and environment configuration
  controllers/  MVC request handlers
  middleware/   Authentication, validation, sanitization, and errors
  models/       User, Movie, Theatre, Show, and Booking
  routes/       REST API route definitions
  scripts/      Non-destructive sample-data and admin seed
  test/         Node.js built-in tests
  utils/        Shared token, seat, and booking-reference helpers
frontend/
  src/
```

## Backend Setup

Use Node.js 20.19+ or 22.12+ for Vite 8 and a MongoDB Atlas cluster. From PowerShell:

```powershell
cd C:\Users\hp\OneDrive\Desktop\Imovies\backend
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

The command above creates `.env` only if it does not already exist, so existing Atlas credentials are preserved. Edit `backend/.env` locally. Set:

- `MONGO_URI` to the connection string copied from Atlas; it must begin with `mongodb+srv://`
- `JWT_SECRET` to a unique random secret of at least 32 characters with adequate character diversity
- `JWT_EXPIRES_IN` to a duration such as `7d`
- `CLIENT_URL` to the frontend origin (defaults to `http://localhost:5173`)
- `PORT` if needed (defaults to `5000`) and `NODE_ENV=development` for local work; `NODE_ENV=production` when deployed

Do not put real credentials in `.env.example`, source files, screenshots, issue reports, or chat logs. `.env` is ignored by Git. In Atlas, create a database user and allow the development machine's current IP in Network Access. Do not use a broad network allowlist for production.

Install dependencies and run the backend:

```powershell
cd C:\Users\hp\OneDrive\Desktop\Imovies\backend
npm install
npm run dev
```

The server validates configuration, waits for Atlas to connect, and only then listens on the configured port. It does not silently connect to localhost. A missing or placeholder Atlas URI or weak JWT secret causes startup to fail with a credential-safe error.

### Current verification status

The latest local environment check found that `backend/.env` still has example placeholders in `MONGO_URI` and that `JWT_SECRET` does not meet the configured strength requirement. No Atlas connection, seed write, or API test was performed during that check. Replace those local values before starting the backend; never share them in chat or documentation.

## Seed Data and Initial Admin

`npm run seed` creates or retains at least 10 sample movies, 3 theatres, and showtimes. It does not delete collections or overwrite existing sample records.

To create an initial admin, temporarily add `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` to the ignored `backend/.env`, then run:

```powershell
npm run seed
```

The admin password must be at least 12 characters and include uppercase, lowercase, and numeric characters. The script hashes it with bcrypt. It will not promote an existing regular user, change an existing admin password, or overwrite existing user data. Remove the `ADMIN_*` values from `.env` after the admin has been created.

## API Overview

All API paths are prefixed with `/api`. Protected requests use:

```text
Authorization: Bearer <JWT>
```

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | API/database readiness |
| POST | `/auth/register` | Public | Register a regular user |
| POST | `/auth/login` | Public | Login |
| GET | `/auth/me` | User | Current authenticated user |
| GET | `/movies` | Public | Search/filter/paginate movies |
| GET | `/movies/:id` | Public | Movie details |
| POST, PUT, DELETE | `/movies...` | Admin | Manage movies |
| GET | `/theatres` | Public | List theatres |
| GET | `/theatres/:id` | Public | Theatre details |
| POST, PUT, DELETE | `/theatres...` | Admin | Manage theatres |
| GET | `/shows` | Public | List/filter shows |
| GET | `/shows/:id` | Public | Show details |
| GET | `/shows/:id/seats` | Public | Seat availability |
| POST, PUT, DELETE | `/shows...` | Admin | Manage shows |
| POST | `/bookings` | User | Reserve seats with demo payment |
| GET | `/bookings/my-bookings` | User | Current user's bookings |
| GET | `/bookings/:id` | Owner or admin | Booking details |
| PATCH | `/bookings/:id/cancel` | Owner or admin | Cancel a future booking |
| GET | `/bookings` | Admin | List all bookings |

Movie list filters: `search`, `genre`, `language`, `status`, `page`, `limit`. Movie status is `now_showing` or `upcoming`. Show filters: `movie`, `theatre`, and ISO date `date=YYYY-MM-DD`.

Create a show with a movie ID, theatre ID, screen name (or screen subdocument ID), ISO `showDate`, 24-hour `startTime`, and `ticketPrice`. Seat capacity is taken from the theatre's screen configuration, not from client input. Create a booking with only:

```json
{
  "showId": "MongoDB show id",
  "selectedSeats": ["A1", "A2"]
}
```

The backend validates the seats, reserves them atomically, and computes the amount using the stored show price. Client-supplied prices are ignored. A simultaneous duplicate reservation returns HTTP `409`. Payment is a demo confirmation only; no real payment details are accepted. A booking can be cancelled only before its show starts; successful cancellation releases its seats.
Show dates and times are currently interpreted as UTC for booking and cancellation checks.

## Tests

Run backend tests and syntax checks:

```powershell
cd C:\Users\hp\OneDrive\Desktop\Imovies\backend
npm test
Get-ChildItem -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

The automated tests cover model validation, seat-layout generation, and health-route behavior without a database. Full route and simultaneous-booking tests require a configured MongoDB Atlas cluster and valid credentials; they are not considered passed until run against that database. See [backend/API_TESTING.md](./backend/API_TESTING.md) for a request-by-request API test guide.

## Frontend

In another PowerShell window:

```powershell
cd C:\Users\hp\OneDrive\Desktop\Imovies\frontend
npm install
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm run dev
```

The Vite development server defaults to `http://localhost:5173`. `.env.example` sets `VITE_API_URL=http://localhost:5000/api`; adjust `.env.local` only if the backend URL differs. The frontend includes API-backed home and movie discovery, details, login/register, showtime and seat selection, demo booking confirmation, booking history/cancellation, profile, and admin catalogue/show/booking management.

The admin UI can only manage capabilities exposed by the existing backend. The API has no registered-user listing endpoint, and the public show list returns active shows only. No real payment is collected. A persistent JWT is stored in browser local storage; use HTTPS in production and keep the site protected against cross-site scripting.

Validate the frontend:

```powershell
npm run build
npm run lint
```

The frontend build and lint have been run successfully. Lint reports React advisory warnings; it does not report errors. Browser smoke checks verified page routes, unauthenticated route redirects, mobile navigation, responsive width, and the retryable API-unavailable state. End-to-end database-backed API behavior has not been validated because the local backend configuration still contains unusable Atlas placeholders. Configure Atlas as described above before claiming or testing live flows.

### Phase 5 integration audit

The current local config was checked without displaying its values: `MONGO_URI` is present but is not a usable non-placeholder Atlas URI, and `JWT_SECRET` is present but is too short/placeholder-like. No database connection or seed operation was attempted; browser requests to the stopped backend were refused. Backend unit tests passed (12/12) and the backend syntax check passed (33 files). Frontend build passed; lint exited successfully with advisory warnings. Booking seat reservation, server-side totals, and transaction logic were audited in code but not runtime-tested against Atlas. See [PROJECT_PROGRESS.md](./PROJECT_PROGRESS.md) for precise passed and pending checks.

## Deployment

Deploy the backend to Render or a compatible Node.js host, the frontend to Vercel, and MongoDB to Atlas. Configure production `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, `PORT`, and `NODE_ENV` in the hosting providers' secret/environment settings. Never upload `.env` files.
