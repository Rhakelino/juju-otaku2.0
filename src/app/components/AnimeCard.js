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
      {/* 1. Tambahkan "flex flex-col" di sini */}
      <div className="bg-[#1A1A29] h-full shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border rounded-xl border-neutral-600/50 hover:border-pink-500/30 transform hover:-translate-y-2 flex flex-col">
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
        <div className="p-4 bg-[#1A1A29] flex flex-col flex-1">
          <h3 className="font-bold bg-[#1A1A29] text-md mb-2 line-clamp-2 text-white/90 group-hover:text-white transition-colors">
            {title}
          </h3>
          <div className="flex bg-[#1A1A29] justify-between items-center text-sm mt-auto">
            <span className="text-neutral-400 bg-[#1A1A29] px-2 py-1 rounded-full text-xs">
              {releaseDay || lastReleaseDate}
            </span>
            <span className="text-pink-400 font-medium flex items-center">
              {newestReleaseDate ? (
                newestReleaseDate
              ) : rating ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                       className="size-4 mr-1">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                  </svg>
                  {rating}
                </>
              ) : (
                null
              )}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default AnimeCard