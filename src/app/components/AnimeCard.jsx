import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const AnimeCard = ({ title, image, slug, episode, statusOrDay, type, priority = false }) => {

  return (
    <Link
      href={`/detail/${slug}`}
      className="group will-change-transform"
    >
      <div className="flex flex-col h-full">

        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
          <Image
            src={image} 
            alt={title}
            unoptimized={true}
            fill
            priority={priority}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105 bg-neutral-700"
          />
          {type && (
            <div className="absolute top-2 right-2 z-10 rounded-md bg-pink-600/80 px-2 py-1 text-xs font-bold text-white">
              <span>{type}</span>
            </div>
          )}
          {episode && (
            <div className="absolute bottom-2 left-2 z-10 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
              {episode.replace('Episode ', 'Eps ')}
            </div>
          )}
        </div>

        <div className="mt-2 px-1">
          <h3 className="font-semibold text-sm text-white line-clamp-2 group-hover:text-pink-400 transition-colors">
            {title}
          </h3>
          {statusOrDay && (
            <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
              <span>{statusOrDay.replace('✓', '')}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default AnimeCard;
