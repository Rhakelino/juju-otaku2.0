// File: AnimeOngoing.jsx
import React from 'react'
import AnimeCard from './AnimeCard'

const AnimeOngoing = ({ api }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 my-12 mx-4 md:mx-24 gap-4 md:gap-6">
      {api.map((anime) => (
        <AnimeCard
          key={anime.slug}
          title={anime.title}
          image={anime.poster}
          slug={anime.slug}
          currentEpisode={anime.current_episode}
          views={anime.release_day}
        />
      ))}
    </div>
  )
}

export default AnimeOngoing