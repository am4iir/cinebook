import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dummyShowsData } from "../assets/assets";
import BlurCircle from "../components/BlurCircle";
import { HeartIcon, StarIcon } from "lucide-react";
import toast from "react-hot-toast";
import timeFormat from "../lib/timeFormat";
import {
  formatShowDate,
  formatShowTime,
  getUpcomingDates,
  SHOW_TIMES,
  TICKET_PRICE,
} from "../lib/showtimes";
import { isFavorite, toggleFavorite } from "../lib/storage";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const movie = dummyShowsData.find((show) => String(show.id) === String(id));

  const dates = useMemo(() => getUpcomingDates(4), []);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedTime, setSelectedTime] = useState(SHOW_TIMES[0]);
  const [favorite, setFavorite] = useState(() => isFavorite(id));

  const handleFavorite = () => {
    const next = toggleFavorite(id);
    setFavorite(next);
    toast.success(next ? "Added to favorites" : "Removed from favorites");
  };

  const handleBook = () => {
    navigate(
      `/movies/${movie.id}/${selectedDate}?time=${encodeURIComponent(selectedTime)}`,
    );
    scrollTo(0, 0);
  };

  if (!movie) {
    return (
      <h1 className="px-6 pt-40 text-center text-3xl font-bold">
        Movie not found
      </h1>
    );
  }

  return (
    <div className="px-6 pb-24 pt-32 md:px-16 md:pt-40 lg:px-40">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row">
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="h-104 max-w-70 rounded-xl object-cover max-md:mx-auto"
        />

        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />
          <p className="text-primary">ENGLISH</p>

          <div className="flex items-start gap-4">
            <h1 className="max-w-96 text-balance text-4xl font-semibold">
              {movie.title}
            </h1>
            <button
              type="button"
              onClick={handleFavorite}
              aria-label={
                favorite ? "Remove from favorites" : "Add to favorites"
              }
              className="mt-1 rounded-full border border-white/15 p-2 transition hover:border-primary"
            >
              <HeartIcon
                className={`h-5 w-5 ${
                  favorite ? "fill-primary text-primary" : "text-white"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="h-5 w-5 fill-primary text-primary" />
            {movie.vote_average.toFixed(1)} User Rating
          </div>

          <p className="mt-2 max-w-xl text-sm leading-tight text-gray-400">
            {movie.overview}
          </p>

          <p className="text-gray-300">
            {timeFormat(movie.runtime)} |{" "}
            {movie.genres.map((genre) => genre.name).join(", ")} |{" "}
            {movie.release_date.split("-")[0]}
          </p>

          <div className="mt-6">
            <p className="mb-2 text-sm text-gray-400">Select a date</p>
            <div className="flex flex-wrap gap-2">
              {dates.map((date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    selectedDate === date
                      ? "border-primary bg-primary text-white"
                      : "border-white/15 text-gray-300 hover:border-white/40"
                  }`}
                >
                  {formatShowDate(date)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm text-gray-400">Select a showtime</p>
            <div className="flex flex-wrap gap-2">
              {SHOW_TIMES.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    selectedTime === time
                      ? "border-primary bg-primary text-white"
                      : "border-white/15 text-gray-300 hover:border-white/40"
                  }`}
                >
                  {formatShowTime(time)}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleBook}
            className="mt-6 w-fit rounded-full bg-primary px-7 py-3 font-medium transition hover:bg-primary-dull"
          >
            Book tickets · {TICKET_PRICE} MAD
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
