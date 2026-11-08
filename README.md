# 🎬 CineBook — Movie Ticket Booking App

A movie ticket booking web app built with React, Vite, Tailwind CSS and Clerk. Browse movies, pick a showtime, select your seats and manage your bookings — with authentication and a persistent favorites list.

> **Note:** this is a frontend project. Movie data is mocked and bookings are stored in the browser (`localStorage`). A real API/backend is on the roadmap.

---

## Features

- 🎥 **Browse movies** — now-showing grid with posters, ratings, genres and runtime
- ▶️ **Trailers** — watch trailers without leaving the app
- 🎬 **Movie details** — synopsis, cast, rating, runtime and release year
- 🗓️ **Showtime selection** — pick one of the next 4 days and a showtime
- 🪑 **Interactive seat map** — 8 rows × 10 seats, with taken seats and a 6-seat limit
- 🎟️ **Booking confirmation** — tickets saved per signed-in user
- 📋 **My bookings** — view and cancel reservations
- ❤️ **Favorites** — save movies from the grid or the details page
- 🔐 **Authentication** — Clerk sign-in with a user menu
- 📱 **Responsive UI** — mobile-first layout with Tailwind CSS
- 🔔 **Toast feedback** — clear feedback for every action

---

## Tech stack

| Layer | Technology |
|---|---|
| UI | React 19, React Router 7, Tailwind CSS 4 |
| Build tool | Vite |
| Auth | Clerk (`@clerk/clerk-react`) |
| Icons / feedback | lucide-react, react-hot-toast |
| Media | react-player |

---

## Getting started

### Prerequisites

- Node.js 18+
- A free [Clerk](https://clerk.com) account

### Installation

```bash
git clone https://github.com/am4iir/cinebook.git
cd cinebook
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

You can copy `.env.example` and replace the value with your own key from the Clerk dashboard.

> The Clerk **publishable** key is meant to be public in frontend apps. Never commit secret keys.

### Run locally

```bash
npm run dev
```

Open `http://localhost:5173`.

### Build

```bash
npm run build
npm run preview
```

---

## Routes

| Route | Page |
|---|---|
| `/` | Home — hero, featured movies, trailers |
| `/movies` | All movies |
| `/movies/:id` | Movie details + date & showtime selection |
| `/movies/:id/:date` | Seat selection and booking |
| `/my-bookings` | User bookings (requires sign-in) |
| `/favorite` | Favorite movies |

---

## Project structure

```
src/
├── assets/        # images and mock movie data
├── components/    # Navbar, Footer, MovieCard, HeroSection, ...
├── lib/           # time formatting, showtimes, storage helpers
├── pages/         # Home, Movies, MovieDetails, SeatLayout, MyBookings, Favorite
├── App.jsx        # routes
├── main.jsx       # app entry + Clerk provider
└── index.css      # Tailwind theme
```

---

## Roadmap

- [ ] Replace mock data with a real API (TMDB)
- [ ] Add a backend (Express + MongoDB) to persist bookings and occupied seats
- [ ] Prevent double-booking across users
- [ ] Online payment integration
- [ ] Admin dashboard for movies and showtimes
- [ ] Unit tests for the booking logic

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file.
