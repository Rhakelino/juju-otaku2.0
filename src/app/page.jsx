import AnimeCompleted from "@/app/components/AnimeCompleted";
import AnimeOngoing from "@/app/components/AnimeOngoing";
import Header from "@/app/components/Header";
import HeroSection from "@/app/components/HeroSection";
import React from 'react'; // <-- Tambahkan impor React untuk Suspense

/**
 * Komponen Warning Sederhana
 * (Teks Anda sudah saya sesuaikan)
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

/**
 * Komponen Skeleton Sederhana
 * Ini akan ditampilkan saat 'AnimeCompleted' sedang dimuat
 */
function AnimeListSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 my-12 mx-4 md:mx-24 gap-4 md:gap-6">
      {/* Tampilkan 5 placeholder card */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="aspect-[2/3] w-full rounded-lg bg-neutral-800 animate-pulse"></div>
      ))}
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
      <HeroSection />
      
      <Header title="Anime OnGoing" />
      {/* Bagian Ongoing dimuat langsung karena berada di atas */}
      {ongoingFetchFailed ? (
        <ApiWarningMessage sectionTitle="OnGoing" />
      ) : (
        <AnimeOngoing api={animeOngoing}/>
      )}

      {/* --- GUNAKAN SUSPENSE DI SINI --- */}
      {/* Ini memberitahu Next.js untuk mengirim Hero/Ongoing dulu,
          lalu men-streaming bagian Completed saat siap. */}
      <React.Suspense fallback={<AnimeListSkeleton />}>
        <Header title="Anime Completed" />
        {completedFetchFailed ? (
          <ApiWarningMessage sectionTitle="Completed" />
        ) : (
          <AnimeCompleted api={animeComplete}/>
        )}
      </React.Suspense>
      {/* --- AKHIR SUSPENSE --- */}
    </>
  );
}

export default Home;