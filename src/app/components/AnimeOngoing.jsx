import React from 'react'
import AnimeCard from './AnimeCard'

const AnimeOngoing = ({api}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 my-12 mx-4 md:mx-24 gap-6">
        {api.map((anime, key) => (
          <AnimeCard title={anime.title} key={anime.slug} image={anime.poster} releaseDay={anime.release_day} slug={anime.slug} currentEpisode={anime.current_episode} newestReleaseDate={anime.newest_release_date} />
        ))}
      </div>
  )
}

export default AnimeOngoing