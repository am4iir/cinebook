import React from "react";
import { useState } from "react";
import { dummyTrailers } from "../assets/assets";
import ReactPlayer from "react-player";
import BlurCircle from "./BlurCircle";
import { PlayCircle } from "lucide-react";

const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden relative">
      {/* Background image dynamique */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm transition-all duration-500"
        style={{ backgroundImage: `url(${currentTrailer.image})` }}
      />

      <div className="relative z-10">
        <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">
          Trailers
        </p>
        <div className="relative mt-6">
          <BlurCircle top="-100px" right="-100px" />
          <div className="mx-auto max-w-[960px] shadow-2xl shadow-primary/50 rounded-lg overflow-hidden">
            <ReactPlayer
              url={currentTrailer.videoUrl}
              controls={true}
              className="mx-auto max-w-full"
              width="960px"
              height="540px"
              light={false}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-6 max-w-[960px] mx-auto overflow-x-auto relative z-10">
        {dummyTrailers.map((trailer, index) => (
          <div
            key={index}
            onClick={() => setCurrentTrailer(trailer)}
            className={`relative w-40 h-24 rounded-lg cursor-pointer transition group ${
              currentTrailer.videoUrl === trailer.videoUrl
                ? "border-2 border-primary"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <img
              src={trailer.image}
              alt={`Trailer ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />

            <div className="absolute inset-0 bg-black/30 rounded-lg group-hover:bg-black/40 transition" />

            <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-white/90 group-hover:text-white group-hover:scale-110 transition" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailerSection;
