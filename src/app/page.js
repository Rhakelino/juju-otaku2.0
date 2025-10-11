import AnimeCard from "./components/AnimeCard";
import HeroSection from "./components/HeroSection";

const Home = async () => {

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const response = await fetch(`${apiUrl}/home`)
  const result = await response.json()
  const animeOngoing = await result.data.ongoing_anime
  const animeComplete = await result.data.complete_anime

  return (
    <>
      <HeroSection />
      <div className="text-center my-4">
        <h2 className="text-3xl font-bold text-white mb-2">Anime OnGoing</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 my-12 mx-4 md:mx-24 gap-6">
        {animeOngoing.map((anime, key) => (
          <AnimeCard title={anime.title} key={anime.slug} image={anime.poster} releaseDay={anime.release_day} slug={anime.slug} currentEpisode={anime.current_episode} newestReleaseDate={anime.newest_release_date} />
        ))}
      </div>
      <div className="text-center my-4">
        <h2 className="text-3xl font-bold text-white mb-2">Anime Complete</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 my-12 mx-4 md:mx-24 gap-6">
        {animeComplete.map((anime, key) => (
          <AnimeCard title={anime.title} key={key} image={anime.poster} releaseDay={anime.release_day} slug={anime.slug} rating={anime.rating} episodeCount={anime.episode_count} lastReleaseDate={anime.last_release_date} />
        ))}
      </div>
    </>
  );
}

export default Home