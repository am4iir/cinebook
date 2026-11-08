const BOOKINGS_KEY = "cinebook:bookings";
const FAVORITES_KEY = "cinebook:favorites";

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode / quota). Fail silently.
  }
};

/* ------------------------------- Bookings ------------------------------- */

export const getAllBookings = () => read(BOOKINGS_KEY, []);

export const getBookings = (userId) => {
  const bookings = getAllBookings();
  if (!userId) return [];
  return bookings.filter((booking) => booking.userId === userId);
};

export const addBooking = (booking) => {
  const bookings = getAllBookings();
  write(BOOKINGS_KEY, [booking, ...bookings]);
  return booking;
};

export const cancelBooking = (bookingId) => {
  const bookings = getAllBookings();
  write(
    BOOKINGS_KEY,
    bookings.filter((booking) => booking.id !== bookingId),
  );
};

export const getBookedSeats = (movieId, date, time) =>
  getAllBookings()
    .filter(
      (booking) =>
        String(booking.movieId) === String(movieId) &&
        booking.date === date &&
        booking.time === time,
    )
    .flatMap((booking) => booking.seats);

/* ------------------------------- Favorites ------------------------------ */

export const getFavorites = () => read(FAVORITES_KEY, []);

export const isFavorite = (movieId) =>
  getFavorites().includes(String(movieId));

export const toggleFavorite = (movieId) => {
  const id = String(movieId);
  const favorites = getFavorites();
  const next = favorites.includes(id)
    ? favorites.filter((favorite) => favorite !== id)
    : [...favorites, id];

  write(FAVORITES_KEY, next);
  return next.includes(id);
};
