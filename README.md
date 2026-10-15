# EventFlow — Event Discovery & Ticket Booking Platform

Discover events. Explore experiences. Manage your bookings.

EventFlow is a full-stack web application designed to make discovering events and managing ticket bookings simple and convenient. Users can explore events, browse by category, create an account, authenticate securely, and manage their bookings through a dedicated interface.

## Screenshots



### Homepage
![EventFlow Homepage](screenshots/homepage)

### Event Discovery
![Event Discovery](screenshots/event_discovery)

###Book seat
(screenshots/book_seat)

### Authentication
![Login](screenshots/login)
![signup](screenshots/signup)

### My Bookings
![My Bookings](screenshots/my_booking)

## Key Features

- **Event Discovery:** Browse available events with relevant event information.
- **Category-Based Browsing:** Explore events by category.
- **Search:** Find events using the available search functionality.
- **User Authentication:** Sign up, log in, and log out securely.
- **Session Management:** Authenticate requests using JWT-based authentication with an HTTP-only cookie.
- **Booking Management:** Create bookings and view your existing bookings.
- **Database-Backed Bookings:** Store booking information and retrieve it for authenticated users.
- **Inventory Management:** Track event availability and ticket or seat inventory.
- **Responsive Interface:** A clean interface designed for a convenient browsing experience.

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- REST API

### Database & Authentication
- Supabase
- PostgreSQL
- JSON Web Tokens (JWT)
- HTTP-only authentication cookies

## Application Architecture

EventFlow follows a client-server architecture.

1. The React frontend displays the event discovery and booking interface.
2. The frontend communicates with the Express backend through REST API endpoints.
3. The backend validates requests and handles authentication and booking operations.
4. Supabase PostgreSQL stores event, user, inventory, and booking data.
5. Booking operations use database-side validation and locking to help prevent conflicting reservations.

## Project Structure

```text
eventflow/
├── client/
│   └── src/
│       ├── components/
│       └── App.jsx
├── server/
│   └── src/
│       ├── config/
│       ├── middleware/
│       └── routes/
├── screenshots/
├── package-lock.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- A Supabase project
- Git

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd eventflow
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the actual repository URL.

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in the server directory and configure the environment variables required by your backend.

Example variable names:

```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SECRET_KEY=your_server_side_secret_key
JWT_SECRET=your_strong_random_secret
```

Use the exact variable names expected by your backend code. Never commit real credentials or secret keys to GitHub.

Configure your Supabase database schema, tables, and booking RPC function before running the application.

Start the backend using the appropriate script from `server/package.json`, for example:

```bash
npm run dev
```

### 3. Set up the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

## API Overview

The backend exposes REST API endpoints for event discovery, authentication, inventory, and booking management.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/events` | Retrieve available events |
| POST | `/api/auth/signup` | Register a user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Retrieve the authenticated user |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/bookings` | Retrieve the user's bookings |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/inventory/:eventId` | Retrieve event inventory |

## Booking Workflow

1. Browse events and select an event.
2. Authenticate to your account.
3. Select the available booking option.
4. Submit a booking request.
5. The backend validates the request and processes the booking against the database.
6. View your bookings in the My Bookings section.

## Security & Data Integrity

- Authentication uses JWT-based tokens stored in HTTP-only cookies.
- Protected endpoints require authentication.
- Booking validation is handled by the backend.
- Database-side locking and availability checks help prevent conflicting seat or ticket reservations.
- Server-side credentials must be configured through environment variables.

## Future Improvements

- Online payment integration.
- Digital ticket generation.
- QR-based ticket verification.
- Event organizer dashboard.
- Booking cancellation and refund workflows.
- Deployment with a production database and hosted frontend/backend.

## Author

**Tanmay Shelar**

GitHub: [TanmayShelar43](https://github.com/TanmayShelar43)

---

*EventFlow is a portfolio project focused on full-stack web development, authentication, database-backed booking workflows, and inventory management.*
