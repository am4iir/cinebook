import { HeartIcon, StarIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import timeFormat from "../lib/timeFormat";
import { isFavorite, toggleFavorite } from "../lib/storage";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(() => isFavorite(movie.id));

  const openMovie = () => {
    navigate(`/movies/${movie.id}`);
    scrollTo(0, 0);
  };

  const handleFavorite = (event) => {
    event.stopPropagation();
    const next = toggleFavorite(movie.id);
    setFavorite(next);
    toast.success(next ? "Added to favorites" : "Removed from favorites");
  };

  return (
    <div className="flex w-66 flex-col justify-between rounded-2xl bg-gray-800 p-3 transition duration-300 hover:-translate-y-1">
      <div className="relative h-96">
        <button
          type="button"
          onClick={handleFavorite}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-2 backdrop-blur transition hover:bg-black/80"
        >
          <HeartIcon
            className={`h-4 w-4 ${
              favorite ? "fill-primary text-primary" : "text-white"
            }`}
          />
        </button>

        <img
          onClick={openMovie}
          src={movie.backdrop_path}
          alt={movie.title}
          className="h-52 w-full cursor-pointer rounded-lg object-cover object-right-bottom"
        />

        <p className="mt-2 truncate font-semibold">{movie.title}</p>
        <p className="mt-2 text-sm text-gray-400">
          {new Date(movie.release_date).getFullYear()} |{" "}
          {movie.genres
            .slice(0, 2)
            .map((genre) => genre.name)
            .join(" | ")}{" "}
          | {timeFormat(movie.runtime)} min
        </p>

        <div className="mt-4 flex items-center justify-between pb-3">
          <button
            onClick={openMovie}
            className="cursor-pointer rounded-full bg-primary px-4 py-2 text-xs font-medium transition hover:bg-primary-dull"
          >
            Buy Tickets
          </button>
          <p className="flex items-center gap-1">
            <StarIcon className="h-4 w-4 fill-primary text-primary" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
