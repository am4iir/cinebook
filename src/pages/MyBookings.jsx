import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { CalendarIcon, ClockIcon, TicketIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import { cancelBooking, getBookings } from "../lib/storage";
import { formatShowDate, formatShowTime } from "../lib/showtimes";

const MyBookings = () => {
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const [bookings, setBookings] = useState([]);

  const refresh = useCallback(() => {
    if (user) {
      setBookings(getBookings(user.id));
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleCancel = (bookingId) => {
    cancelBooking(bookingId);
    refresh();
    toast.success("Booking cancelled");
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">Loading your bookings…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <TicketIcon className="h-10 w-10 text-primary" />
        <h1 className="text-2xl font-semibold">Sign in to see your bookings</h1>
        <p className="max-w-md text-gray-400">
          Your tickets are linked to your account. Sign in to manage your
          reservations.
        </p>
        <button
          type="button"
          onClick={openSignIn}
          className="rounded-full bg-primary px-6 py-2 font-medium hover:bg-primary-dull"
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 pb-24 pt-32 md:px-16 lg:px-32">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">My bookings</h1>
        <p className="mt-2 text-gray-400">
          {bookings.length > 0
            ? `You have ${bookings.length} upcoming ${
                bookings.length === 1 ? "booking" : "bookings"
              }.`
            : "Your reservations will appear here."}
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 py-20 text-center">
          <TicketIcon className="mb-4 h-10 w-10 text-gray-600" />
          <h2 className="text-xl font-medium">No bookings yet</h2>
          <p className="mt-2 max-w-sm text-gray-400">
            Pick a movie, choose your seats and your tickets will show up here.
          </p>
          <Link
            to="/movies"
            className="mt-6 rounded-full bg-primary px-6 py-2 font-medium hover:bg-primary-dull"
          >
            Browse movies
          </Link>
        </div>
      ) : (
        <div className="grid gap-5">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 sm:flex-row"
            >
              <img
                src={booking.poster}
                alt={booking.title}
                className="h-40 w-28 rounded-xl object-cover"
              />

              <div className="flex flex-1 flex-col justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{booking.title}</h2>

                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                    <span className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {formatShowDate(booking.date)}
                    </span>
                    <span className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4" />
                      {formatShowTime(booking.time)}
                    </span>
                    <span className="flex items-center gap-2">
                      <TicketIcon className="h-4 w-4" />
                      {booking.seats.join(", ")}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="text-lg font-semibold">{booking.total} MAD</p>
                  <button
                    type="button"
                    onClick={() => handleCancel(booking.id)}
                    className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-gray-300 transition hover:border-primary hover:text-white"
                  >
                    <XIcon className="h-4 w-4" />
                    Cancel booking
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
