import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const AnimeCard = ({ title, image, releaseDay, slug, currentEpisode, newestReleaseDate, rating, episodeCount, lastReleaseDate }) => {
  return (
    <Link
      key={slug}
      href={`/anime/${slug}`}
      className="group"
    >
      <div className="bg-[#1A1A29] h-full shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border rounded-xl border-neutral-600/50 hover:border-pink-500/30 transform hover:-translate-y-2">
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            width={500}
            height={500}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {currentEpisode && (
            <div className="absolute top-3 right-3 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              {currentEpisode}
            </div>
          )}
          {episodeCount && (
            <div className="absolute top-3 right-3 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              {episodeCount} Episode
            </div>
          )}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2">
              <p className="text-white text-xs font-medium">Klik untuk detail</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-[#1A1A29]">
          <h3 className="font-bold bg-[#1A1A29] text-lg mb-2 line-clamp-2 text-white/90 group-hover:text-white transition-colors">
            {title}
          </h3>
          <div className="flex bg-[#1A1A29] justify-between items-center text-sm">
            <span className="text-neutral-400 bg-[#1A1A29] px-2 py-1 rounded-full text-xs">
              {releaseDay || lastReleaseDate}
            </span>
            <span className="text-pink-400 font-medium">
              {newestReleaseDate || rating}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default AnimeCard