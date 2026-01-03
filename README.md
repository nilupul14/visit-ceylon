<img width="1852" height="944" alt="image" src="https://github.com/user-attachments/assets/87ca10ea-2126-4a3e-8f10-4a8f8b996545" />

## Visit Ceylon

https://visit-ceylon-client.vercel.app

Visit Ceylon is a full stack travel booking experience for Sri Lanka. The project combines a Vite + React 19 single page app, a Tailwind driven design system, and an Express 5 API that orchestrates Clerk authentication, MongoDB Atlas, Stripe Checkout, Google Maps, Inngest background jobs, and transactional email. The repo is structured as a lightweight mono-repo (`client` + `server`) that can be deployed independently (Vercel configs are already included) or run together for local development.

## Repository layout

```
visit-ceylon/
|- client/            # Vite + React 19 frontend
|  |- src/assets      # Destination seed data, media, map helpers
|  |- src/components  # UI building blocks (Navbar, VisitCeylonMap, CinematicTeaser, etc.)
|  |- src/context     # AppContext: auth state, API helpers, shared stores
|  `- src/pages       # Home, Destinations, Map, Admin dashboard, etc.
|- server/            # Express API
|  |- configs         # Mongo connection (custom DNS), nodemailer setup
|  |- controllers     # Feature logic (booking, destination, admin, stripe)
|  |- inngest         # Workflow definitions (Clerk sync, reminders, email)
|  |- middleware      # Clerk based admin guard
|  |- models          # Mongoose schemas (Destination, Visit, Booking, Show, Movie, User)
|  |- routes          # REST routers mounted in server.js
|  `- map             # Google Maps geocode helper script
`- README.md (this file)
```

## Feature highlights

- Destination discovery with hero cinematic teaser, curated lists, favorites, and deep links into visit slots and seat selection flows.
- Live Explore Map powered by `@react-google-maps/api` that plots curated coordinates and syncs with a gallery strip.
- Booking workflow with seat layout, Stripe Checkout integration, Clerk protected user bookings, and admin seeded booking data for demos.
- Admin dashboard for operators to seed destinations, manage visits, review bookings, and monitor revenue metrics.
- Real time auth-aware UI using Clerk on the client (`ClerkProvider`) plus `clerkMiddleware` on the API to guard admin and user routes.
- Background workflows built with Inngest (Clerk user sync, payment timeouts, booking confirmations, recurring reminders, new show notifications).
- Email and notification plumbing through Brevo SMTP (via Nodemailer) and toast level UX feedback using `react-hot-toast`.

### Roles and access

- `sys_admin`: full superuser access (bypasses other role checks).
- `admin`: legacy admin role with broad management rights.
- `business_manager`: can view dashboards and bookings for oversight.
- `financial_manager`: can view dashboards and bookings for revenue reporting.
- `site_manager`: can manage destinations/shows (add/remove inventory).
Set these in Clerk `privateMetadata.roles` (array) or `privateMetadata.role` (string). The API treats both formats the same.

## Tech stack and third party modules

### Frontend (client/)

- JavaScript (ES2023) + React 19 + React Router 7 for SPA routing.
- Vite 6 bundler with `@tailwindcss/vite` (Tailwind CSS v4) and PostCSS free index level theming.
- Tailwind authored UI components plus `lucide-react` for iconography.
- Clerk React SDK for authentication widgets (`SignIn`, `ClerkProvider`).
- State shared through `AppContext` (React Context API, `axios`, `react-hot-toast` for notifications).
- Destinations map built with `@react-google-maps/api` and Google Maps JS API.
- Media and UX helpers: `react-player` for the cinematic teaser, `react-player`, custom date/number formatters, and `react-router-dom` loaders.

### Backend (server/)

- Node 20+ (uses global fetch and top level await) with Express 5, CORS, and `dotenv/config`.
- MongoDB Atlas via Mongoose 8 (schemas for User, Destination, Visit, Movie, Show, Booking).
- Clerk Express middleware plus `@clerk/express` client for auth enforcement and metadata management.
- Stripe SDK for Checkout sessions and webhook processing.
- Inngest SDK for background jobs (webhook syncing, payment watchdog, reminders, broadcasts).
- Nodemailer configured for Brevo (smtp-relay.brevo.com) transactional messages.
- Cloudinary SDK (existing URLs in `client/src/assets`), axios (TMDB fetch, TMDB now playing, etc.), and Svix for Clerk webhook signature validation when needed.
- Custom Mongo connection logic that patches the DNS resolver to prefer Google/Cloudflare servers, useful inside restrictive hosting.

### External services

- Clerk (multi-tenant auth, admin roles via private metadata, webhooks into Inngest).
- Stripe (Checkout, payment_intent webhooks, session metadata to reconcile bookings).
- MongoDB Atlas (primary data store).
- Google Maps Platform (JS SDK on the client, Geocoding API for the `server/map/mapview.js` helper).
- The Movie Database (TMDB) API for show metadata and imagery (server controllers rely on `TMDB_API_KEY`).
- Cloudinary CDN (static media referenced in seed data).
- Brevo SMTP (email transport credentials).
- Inngest cloud (event ingestion via `INNGEST_EVENT_KEY` and signing key).
- Vercel (deployment targets configured via `vercel.json` in both apps).

## Getting started

### Prerequisites

- Node.js 20.11+ and npm 10+ (required for native fetch, top level await, and Vite 6).
- MongoDB Atlas database (or locally accessible MongoDB URI).
- Clerk application (publishable + secret keys, and at least one privileged user with `privateMetadata.roles` or `privateMetadata.role` set to one of: `sys_admin`, `admin`, `business_manager`, `site_manager`, `financial_manager`).
- Stripe account with secret key, publishable key, and a webhook secret (Stripe CLI recommended for local testing).
- Google Maps API key (Maps JS + Geocoding enabled).
- TMDB API read token.
- Brevo (or any SMTP) credentials for booking emails.
- Inngest account keys (or use dev mode with mocked handlers).

### 1. Environment files

Create `server/.env` and `client/.env` (use the tables in **Project configuration** as your checklist). If you already have private `.env` files from another environment, copy them instead. Never commit real secrets.

### 2. Install dependencies

```
cd server
npm install

cd ../client
npm install
```

### 3. Run the API (port 3000)

```
cd server
npm run server        # uses nodemon
# or
npm start             # plain node server.js
```

The API automatically connects to MongoDB, mounts `/api/*` routers, Stripe webhooks (`/api/stripe`), and exposes Inngest functions on `/api/inngest`.

### 4. Run the client (default Vite port 5173)

```
cd client
npm run dev
```

Set `VITE_BASE_URL` to the API origin (for local dev, `http://localhost:3000`). The client bootstraps `ClerkProvider`, `BrowserRouter`, and `AppProvider` before rendering `App`.

### 5. Optional scripts

- `npm run build` (client) builds the production bundle for deployment.
- `npm run preview` (client) serves the Vite build locally.
- `npm run lint` (client) runs ESLint with the shared config in `eslint.config.js`.
- `npm run server` (server) watches `server.js` with nodemon.

## Project configuration

### Client environment variables (`client/.env`)

| Variable | Purpose |
| --- | --- |
| `VITE_BASE_URL` | URL of the Express API. Used as the axios default base URL inside `AppContext`. |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key required by `ClerkProvider` in `src/main.jsx`. |
| `VITE_CURRENCY` | Currency symbol shown in UI components (defaults to `$`). |
| `VITE_TMDB_IMAGE_BASE_URL` | CDN base used when resolving TMDB poster paths. |
| `VITE_GOOGLE_MAPS_API_KEY` | Browser key passed to `useLoadScript` in `VisitCeylonMap`. |
| `VITE_GOOGLE_MAP_ID` | Optional custom map styling ID if you enable vector basemaps. |

### Server environment variables (`server/.env`)

| Variable | Purpose |
| --- | --- |
| `PORT` | Optional override for the Express port (defaults to 3000). |
| `MONGODB_URI` | MongoDB connection string. `configs/db.js` auto-appends `/visitceylon` if you omit a database name. |
| `MONGODB_DNS_SERVERS` | Optional comma separated DNS servers (defaults to `8.8.8.8,1.1.1.1`). |
| `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Required for `clerkMiddleware`, admin guard, and metadata management. |
| `TMDB_API_KEY` | Bearer token used in `showController` when fetching movie metadata. |
| `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Stripe Checkout creation and webhook verification. |
| `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY` | Authorizes the `/api/inngest` endpoint and server-to-Inngest events (`inngest.send`). |
| `SENDER_EMAIL`, `SMTP_USER`, `SMTP_PASS` | Brevo (or SMTP) credentials used by `configs/nodeMailer.js`. |
| `GOOGLE_MAPS_API_KEY` | Required if you run the `server/map/mapview.js` geocoding helper from Node. |

### Deployment presets

- `client/vercel.json` rewrites all paths to `/` so the SPA can handle routing.
- `server/vercel.json` configures `server.js` as an `@vercel/node` function and bundles any `dist/**` assets if you later build background jobs.

### Styling and build system

- Tailwind 4 is imported globally in `client/src/index.css` with `@theme` tokens (`--color-primary`, etc.).
- The project uses the new `@tailwindcss/vite` plugin configured in `vite.config.js`, so there is no `tailwind.config.js`.
- `AppContext` centralizes axios defaults and fetches for destinations, bookings, favorites, and admin state, so ensure `VITE_BASE_URL` points to a reachable API origin.

## API surface

| Route | Description |
| --- | --- |
| `GET /api/show/now-playing` | Proxy to TMDB now playing feed (admin protected). |
| `POST /api/show/add` | Seeds Movie + Show documents from TMDB data and emits `app/show.added`. |
| `GET /api/show/all`, `GET /api/show/:movieId` | Read upcoming shows for the UI. |
| `GET /api/destinations` | List curated destinations used across pages. |
| `POST /api/destinations/seed` | Upsert destinations from request body or `client/src/assets/assets.js`. |
| `POST /api/destinations/visits` | Create visit slots (`Visit` documents) for a destination. |
| `GET /api/destinations/:destinationId/visits` | Fetch grouped visit slots per day. |
| `POST /api/bookings` | Create a booking (lightweight version used by admin tooling). |
| `GET /api/bookings` | Filterable booking list consumed by the admin dashboard. |
| `GET /api/bookings/:id` | Lookup booking by Mongo `_id` or custom `bookingId`. |
| `GET /api/user/bookings` | Clerk protected list of the authenticated user's bookings. |
| `GET /api/user/favorites`, `POST /api/user/update-favorite` | Store favorites in Clerk metadata. |
| `GET /api/admin/dashboard`, `/all-shows`, `/all-bookings` | Admin metrics and raw lists. |
| `POST /api/admin/add-destination` | Seeds demo bookings/shows (see `controllers/adminController.js`). |
| `POST /api/stripe` | Webhook endpoint handling `payment_intent.succeeded` events. |
| `POST /api/inngest/*` | Inngest function runner (used by the Cloud hosted Inngest UI). |

## Background jobs (Inngest)

Defined in `server/inngest/index.js`:

- `sync-user-from-clerk`, `update-user-from-clerk`, `delete-user-with-clerk` keep Mongo in sync with Clerk webhooks.
- `release-seats-delete-booking` waits 10 minutes for unpaid bookings, then frees seats and deletes stale bookings.
- `send-booking-confirmation-email` triggers after Stripe confirms payment (`app/show.booked`).
- `send-show-reminders` cron runs every 8 hours to remind travelers about upcoming visits.
- `send-new-show-notifications` broadcasts newly added shows/destinations to all users.

## Data seeding and utilities

- Destination seeds live in `client/src/assets/assets.js`. `POST /api/destinations/seed` can read from that file automatically if you do not send a body; useful for new environments.
- Visit slot creation flow (`POST /api/destinations/visits`) expects `{ destinationId, visitsInput: [{ date, time: ["09:00", ...] }], price }`.
- Admin endpoint `POST /api/admin/add-destination` uses an internal `bookingSeedData` array to prefill Shows and Bookings for demos. Update that array before calling the endpoint.
- `server/map/mapview.js` demonstrates how to batch geocode destination titles with the Google Maps Geocoding API. Run it with `node map/mapview.js` after exporting `GOOGLE_MAPS_API_KEY`.

## Testing and verification

The repo does not include automated tests yet. When adding new functionality:

- Prefer unit tests colocated with controllers or hooks.
- Use Stripe CLI to forward webhooks to `http://localhost:3000/api/stripe`.
- Use Clerk's dashboard to send test webhooks so the Inngest functions can be verified locally (Inngest dev server recommended).

## Next steps

- Hook up a process manager (PM2, Docker, or Vercel functions) for production.
- Replace sample `.env` credentials with secrets from your vault before deploying.
- Add integration tests for booking flows and admin actions to prevent regressions.
- Consider wiring `bookingController`'s Stripe Checkout code path back in if you need full seat level enforcement instead of the simplified booking endpoint.
