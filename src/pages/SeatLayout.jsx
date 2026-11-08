import { useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { ArrowLeftIcon, TicketIcon } from "lucide-react";
import toast from "react-hot-toast";
import { dummyShowsData } from "../assets/assets";
import {
  formatShowDate,
  formatShowTime,
  TICKET_PRICE,
} from "../lib/showtimes";
import { addBooking, getBookedSeats } from "../lib/storage";

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const SEATS_PER_ROW = 10;
const MAX_SEATS = 6;

const hashString = (value) => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
};

const createBookingId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `booking-${Date.now()}`;
};

const SeatLayout = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const movie = dummyShowsData.find((show) => String(show.id) === String(id));

  const date = searchParams.get("date") ?? "";
  const time = searchParams.get("time") ?? "14:00";

  const [selectedSeats, setSelectedSeats] = useState([]);

  const bookedSeats = useMemo(
    () => new Set(getBookedSeats(id, date, time)),
    [id, date, time],
  );

  const isSeatTaken = (seat) =>
    bookedSeats.has(seat) ||
    hashString(`${id}:${date}:${time}:${seat}`) % 9 === 0;

  const toggleSeat = (seat) => {
    if (isSeatTaken(seat)) return;

    setSelectedSeats((current) => {
      if (current.includes(seat)) {
        return current.filter((item) => item !== seat);
      }

      if (current.length >= MAX_SEATS) {
        toast.error(`You can book up to ${MAX_SEATS} seats at once`);
        return current;
      }

      return [...current, seat];
    });
  };

  const total = selectedSeats.length * TICKET_PRICE;
  const sortedSeats = [...selectedSeats].sort();

  const handleConfirm = () => {
    if (!user) {
      toast.error("Sign in to complete your booking");
      openSignIn();
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    addBooking({
      id: createBookingId(),
      userId: user.id,
      movieId: movie.id,
      title: movie.title,
      poster: movie.poster_path,
      date,
      time,
      seats: sortedSeats,
      total,
      createdAt: new Date().toISOString(),
    });

    toast.success("Booking confirmed!");
    navigate("/my-bookings");
  };

  if (!movie || !date) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold">Show not found</h1>
        <p className="text-gray-400">
          This showtime is no longer available. Please pick another one.
        </p>
        <Link
          to="/movies"
          className="rounded-full bg-primary px-6 py-2 font-medium hover:bg-primary-dull"
        >
          Browse movies
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 pb-24 pt-32 md:px-16 lg:px-32">
      <Link
        to={`/movies/${movie.id}`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to movie
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-semibold">{movie.title}</h1>
            <p className="mt-1 text-gray-400">
              {formatShowDate(date)} · {formatShowTime(time)}
            </p>
          </div>

          <div className="mb-10 flex flex-col items-center">
            <div className="h-2 w-4/5 rounded-full bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
            <p className="mt-3 text-xs uppercase tracking-[0.3em] text-gray-500">
              Screen
            </p>
          </div>

          <div className="mx-auto max-w-2xl overflow-x-auto">
            <div className="min-w-[520px] space-y-2">
              {ROWS.map((row) => (
                <div key={row} className="flex items-center gap-2">
                  <span className="w-5 text-center text-xs text-gray-500">
                    {row}
                  </span>

                  <div className="flex flex-1 justify-center gap-2">
                    {Array.from({ length: SEATS_PER_ROW }, (_, index) => {
                      const seat = `${row}${index + 1}`;
                      const taken = isSeatTaken(seat);
                      const selected = selectedSeats.includes(seat);

                      return (
                        <button
                          key={seat}
                          type="button"
                          onClick={() => toggleSeat(seat)}
                          disabled={taken}
                          aria-label={`Seat ${seat}`}
                          aria-pressed={selected}
                          className={`h-8 w-8 rounded-t-lg text-[10px] font-medium transition ${
                            taken
                              ? "cursor-not-allowed bg-gray-700 text-gray-500"
                              : selected
                                ? "bg-primary text-white"
                                : "bg-gray-800 text-gray-400 hover:bg-gray-600 hover:text-white"
                          }`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>

                  <span className="w-5 text-center text-xs text-gray-500">
                    {row}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-t bg-gray-800" /> Available
            </span>
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-t bg-primary" /> Selected
            </span>
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-t bg-gray-700" /> Taken
            </span>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-white/10 bg-white/5 p-5 lg:sticky lg:top-28">
          <div className="flex gap-4">
            <img
              src={movie.poster_path}
              alt={movie.title}
              className="h-28 w-20 rounded-lg object-cover"
            />
            <div>
              <h2 className="font-semibold leading-tight">{movie.title}</h2>
              <p className="mt-2 text-sm text-gray-400">
                {formatShowDate(date)}
                <br />
                {formatShowTime(time)}
              </p>
            </div>
          </div>

          <div className="my-5 h-px bg-white/10" />

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Seats</span>
            <span className="font-medium">
              {sortedSeats.length > 0 ? sortedSeats.join(", ") : "None"}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-gray-400">
              {TICKET_PRICE} MAD × {selectedSeats.length}
            </span>
            <span className="font-medium">{total} MAD</span>
          </div>

          <div className="my-5 h-px bg-white/10" />

          <div className="mb-5 flex items-center justify-between">
            <span className="text-gray-400">Total</span>
            <span className="text-xl font-semibold">{total} MAD</span>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-medium transition hover:bg-primary-dull"
          >
            <TicketIcon className="h-4 w-4" />
            {user ? "Confirm booking" : "Sign in to book"}
          </button>

          <p className="mt-3 text-center text-xs text-gray-500">
            Maximum {MAX_SEATS} seats per booking
          </p>
        </aside>
      </div>
    </div>
  );
};

export default SeatLayout;
