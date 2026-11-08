import { Link } from "react-router-dom";
import { HeartIcon } from "lucide-react";
import { dummyShowsData } from "../assets/assets";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import { getFavorites } from "../lib/storage";

const Favorite = () => {
  const favoriteIds = getFavorites();
  const favoriteMovies = dummyShowsData.filter((movie) =>
    favoriteIds.includes(String(movie.id)),
  );

  return (
    <div className="relative my-40 mb-60 min-h-[60vh] overflow-hidden px-6 md:px-16 lg:px-40 xl:px-44">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      <h1 className="my-4 text-2xl font-medium">Your favorite movies</h1>

      {favoriteMovies.length > 0 ? (
        <div className="flex flex-wrap gap-8 max-sm:justify-center">
          {favoriteMovies.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <HeartIcon className="mb-4 h-10 w-10 text-gray-600" />
          <h2 className="text-xl font-medium">No favorites yet</h2>
          <p className="mt-2 max-w-sm text-gray-400">
            Tap the heart on any movie to save it here for later.
          </p>
          <Link
            to="/movies"
            className="mt-6 rounded-full bg-primary px-6 py-2 font-medium hover:bg-primary-dull"
          >
            Browse movies
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorite;
