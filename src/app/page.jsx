import AnimeCompleted from "@/app/components/AnimeCompleted";
import AnimeOngoing from "@/app/components/AnimeOngoing";
import Header from "@/app/components/Header";
import HeroSection from "@/app/components/HeroSection";

const Home = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const responseOnGoing = await fetch(`${apiUrl}/ongoing`)
  const responseCompleted = await fetch(`${apiUrl}/completed`)
  
  const resultOnGoing = await responseOnGoing.json()
  const resultCompleted = await responseCompleted.json()
  const animeOngoing = await resultOnGoing.animes
  const animeComplete = await resultCompleted.animes


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