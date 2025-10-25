import AnimeCompleted from "@/app/components/AnimeCompleted";
import AnimeOngoing from "@/app/components/AnimeOngoing";
import Header from "@/app/components/Header";
import HeroSection from "@/app/components/HeroSection";

const Home = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const responseOnGoing = await fetch(`${apiUrl}/ongoing-anime?page=1`)
  const responseComplete = await fetch(`${apiUrl}/complete-anime/1`)
  
  const resultOnGoing = await responseOnGoing.json()
  const resultComplete = await responseComplete.json()
  const animeOngoing = await resultOnGoing.data.ongoingAnimeData
  const animeComplete = await resultComplete.data.completeAnimeData

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