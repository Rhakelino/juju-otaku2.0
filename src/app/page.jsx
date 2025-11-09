import AnimeCompleted from "@/app/components/AnimeCompleted";
import AnimeOngoing from "@/app/components/AnimeOngoing";
import Header from "@/app/components/Header";
import HeroSection from "@/app/components/HeroSection";

const Home = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Set nilai default jika fetch gagal
  let animeOngoing = [];
  let animeComplete = [];

  try {
    // 1. Kita panggil kedua API secara bersamaan
    const [ongoingResponse, completedResponse] = await Promise.allSettled([
      fetch(`${apiUrl}/ongoing`),
      fetch(`${apiUrl}/completed`)
    ]);

    // 2. Proses hasil 'ongoing' HANYA jika berhasil
    if (ongoingResponse.status === 'fulfilled' && ongoingResponse.value.ok) {
      const resultOnGoing = await ongoingResponse.value.json();
      animeOngoing = resultOnGoing.animes || [];
    } else {
      // Jika gagal, log error-nya tapi jangan bikin crash
      console.error("Gagal mengambil data OnGoing:", 
        ongoingResponse.reason || `Status: ${ongoingResponse.value?.status}`
      );
    }

    // 3. Proses hasil 'completed' HANYA jika berhasil
    if (completedResponse.status === 'fulfilled' && completedResponse.value.ok) {
      const resultCompleted = await completedResponse.value.json();
      animeComplete = resultCompleted.animes || [];
    } else {
      // Jika gagal, log error-nya tapi jangan bikin crash
      console.error("Gagal mengambil data Completed:", 
        completedResponse.reason || `Status: ${completedResponse.value?.status}`
      );
    }

  } catch (error) {
    // Menangkap error jika 'fetch' itu sendiri gagal (misal: masalah jaringan)
    console.error("Error global saat fetch di Home:", error);
  }

  // 4. Render halaman. 
  // 'animeOngoing' dan 'animeComplete' akan berisi data JIKA berhasil,
  // atau array kosong [] JIKA gagal. Halaman tetap ter-render.
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

export default Home;