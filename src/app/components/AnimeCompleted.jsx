// File: AnimeCompleted.jsx
import React from 'react'
import AnimeCard from './AnimeCard'

const AnimeCompleted = ({ api }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 my-12 mx-4 md:mx-24 gap-4 md:gap-6">
      {api.map((anime, index) => (
        <AnimeCard
          key={anime.slug}
          title={anime.title}
          image={anime.poster}
          slug={anime.slug}
          episode={anime.episode}
          type={anime.type}
          statusOrDay={anime.release_day}
          priority={index < 6}
        />
      ))}
    </div>
  )
}

export default AnimeCompleted