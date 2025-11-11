// app/page.js

import AnimeCompleted from "@/app/components/AnimeCompleted";
import AnimeOngoing from "@/app/components/AnimeOngoing";
import Header from "@/app/components/Header";
import HeroSection from "@/app/components/HeroSection";
import React from 'react';
import Navbar from "./components/Navbar"; // <-- 1. IMPORT NAVBAR
import { AuthUserSession } from "./libs/auth-libs"; // <-- 2. IMPORT AUTH

// ... (Komponen ApiWarningMessage dan AnimeListSkeleton Anda tidak berubah) ...
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
// -----------------------------------------------------------------


// Komponen Home Anda (ini SUDAH 'async')
const Home = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // 3. AMBIL DATA USER DI SINI (DI DALAM 'Home')
  const user = await AuthUserSession();

  // Set nilai default jika fetch gagal
  let animeOngoing = [];
  let animeComplete = [];

  // ... (Logika fetch Promise.allSettled Anda tidak berubah) ...
  let ongoingFetchFailed = false;
  let completedFetchFailed = false;
  try {
    const [ongoingResponse, completedResponse] = await Promise.allSettled([
      fetch(`${apiUrl}/ongoing`),
      fetch(`${apiUrl}/completed`)
    ]);
    if (ongoingResponse.status === 'fulfilled' && ongoingResponse.value.ok) {
      const resultOnGoing = await ongoingResponse.value.json();
      animeOngoing = resultOnGoing.animes || [];
    } else {
      console.error("Gagal mengambil data OnGoing:",
        ongoingResponse.reason || `Status: ${ongoingResponse.value?.status}`
      );
      ongoingFetchFailed = true;
    }
    if (completedResponse.status === 'fulfilled' && completedResponse.value.ok) {
      const resultCompleted = await completedResponse.value.json();
      animeComplete = resultCompleted.animes || [];
    } else {
      console.error("Gagal mengambil data Completed:",
        completedResponse.reason || `Status: ${completedResponse.value?.status}`
      );
      completedFetchFailed = true;
    }
  } catch (error) {
    console.error("Error global saat fetch di Home:", error);
    ongoingFetchFailed = true;
    completedFetchFailed = true;
  }
  // -----------------------------------------------------------------


  // 4. Render halaman. 
  return (
    <>
      {/* 4. TAMPILKAN NAVBAR DI SINI, OPER 'user' SEBAGAI PROP */}
      <Navbar user={user} />
      <HeroSection />

      <Header title="Anime OnGoing" />
      {ongoingFetchFailed ? (
        <ApiWarningMessage sectionTitle="OnGoing" />
      ) : (
        <AnimeOngoing api={animeOngoing} />
      )}

      {/* ... (Bagian Suspense Anda tidak berubah) ... */}
      <React.Suspense fallback={<AnimeListSkeleton />}>
        <Header title="Anime Completed" />
        {completedFetchFailed ? (
          <ApiWarningMessage sectionTitle="Completed" />
        ) : (
          <AnimeCompleted api={animeComplete} />
        )}
      </React.Suspense>
    </>
  );
}

export default Home;