import AnimeCompleted from "@/app/components/AnimeCompleted";
import AnimeOngoing from "@/app/components/AnimeOngoing";
import Header from "@/app/components/Header";
import HeroSection from "@/app/components/HeroSection";

/**
 * Komponen Warning Sederhana
 * Kita buat di sini agar mudah
 */
function ApiWarningMessage({ sectionTitle }) {
  return (
    <div className="text-center px-4 py-8">
      <p className="text-lg font-semibold text-yellow-500">
        Gagal Memuat Data {sectionTitle}
      </p>
      <p className="text-sm text-neutral-400">
        API mungkin kena limit atau *offline*. Silakan coba muat ulang nanti.(makanya donate admin🗿)
      </p>
    </div>
  );
}


const Home = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Set nilai default jika fetch gagal
  let animeOngoing = [];
  let animeComplete = [];
  
  // --- FLAG BARU UNTUK MELACAK ERROR ---
  let ongoingFetchFailed = false;
  let completedFetchFailed = false;

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
      // Jika gagal, log error-nya TAPI SET FLAG
      console.error("Gagal mengambil data OnGoing:", 
        ongoingResponse.reason || `Status: ${ongoingResponse.value?.status}`
      );
      ongoingFetchFailed = true; // <-- SET FLAG GAGAL
    }

    // 3. Proses hasil 'completed' HANYA jika berhasil
    if (completedResponse.status === 'fulfilled' && completedResponse.value.ok) {
      const resultCompleted = await completedResponse.value.json();
      animeComplete = resultCompleted.animes || [];
    } else {
      // Jika gagal, log error-nya TAPI SET FLAG
      console.error("Gagal mengambil data Completed:", 
        completedResponse.reason || `Status: ${completedResponse.value?.status}`
      );
      completedFetchFailed = true; // <-- SET FLAG GAGAL
    }

  } catch (error) {
    // Menangkap error jika 'fetch' itu sendiri gagal
    console.error("Error global saat fetch di Home:", error);
    // Jika fetch global gagal, anggap keduanya gagal
    ongoingFetchFailed = true;
    completedFetchFailed = true;
  }

  // 4. Render halaman. 
  return (
    <>
      {/* <HeroSection /> */}
      
      <Header title="Anime OnGoing" />
      {/* --- LOGIKA RENDER BARU --- */}
      {ongoingFetchFailed ? (
        // Jika fetch GAGAL, tampilkan pesan warning
        <ApiWarningMessage sectionTitle="OnGoing" />
      ) : (
        // Jika fetch BERHASIL, tampilkan komponen seperti biasa
        // (Komponen <AnimeOngoing> akan menangani jika 'api' adalah array kosong)
        <AnimeOngoing api={animeOngoing}/>
      )}
      {/* --- AKHIR LOGIKA RENDER --- */}

      <Header title="Anime Completed" />
      {/* --- LOGIKA RENDER BARU --- */}
      {completedFetchFailed ? (
        // Jika fetch GAGAL, tampilkan pesan warning
        <ApiWarningMessage sectionTitle="Completed" />
      ) : (
        // Jika fetch BERHASIL, tampilkan komponen seperti biasa
        <AnimeCompleted api={animeComplete}/>
      )}
      {/* --- AKHIR LOGIKA RENDER --- */}
    </>
  );
}

export default Home;