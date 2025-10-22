import AnimeCompleted from "@/app/components/AnimeCompleted";
import AnimeOngoing from "@/app/components/AnimeOngoing";
import Header from "@/app/components/Header";
import HeroSection from "@/app/components/HeroSection";

const Home = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const response = await fetch(`${apiUrl}/home`)
  const result = await response.json()
  const animeOngoing = await result.data.ongoing_anime
  const animeComplete = await result.data.complete_anime

  return (
    <>
      <HeroSection />
      <Header title="Anime OnGoing" />
      <AnimeOngoing api={animeOngoing}/>
      <Header title="Anime Completed" />
      <AnimeCompleted api={animeComplete}/>
    </>
  );
}

export default Home