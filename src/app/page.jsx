// app/page.js

import AnimeCompleted from "@/app/components/AnimeCompleted";
import AnimeOngoing from "@/app/components/AnimeOngoing";
import Header from "@/app/components/Header";
import HeroSection from "@/app/components/HeroSection";
import React from 'react';
import Navbar from "./components/Navbar"; 
import { AuthUserSession } from "./libs/auth-libs"; 

// ... (Komponen ApiWarningMessage dan AnimeListSkeleton Anda tidak berubah) ...
function ApiWarningMessage({ sectionTitle }) {
  // ... (tidak berubah)
}
function AnimeListSkeleton() {
  // ... (tidak berubah)
}
// -----------------------------------------------------------------


// --- FUNGSI HELPER BARU ---
// Fungsi ini akan fetch dan filter data secara berulang
// sampai jumlah 'desiredLimit' tercapai atau data habis.
async function fetchAndFilterAnime(baseUrl, endpoint, desiredLimit = 10) {
  let filteredAnimes = []; // Array untuk menampung hasil
  let currentPage = 1;
  let hasNextPage = true;
  const validTypes = ['TV', 'Movie', 'Spesial']; // Tipe yang kita inginkan

  // Kita batasi 5 halaman fetch per section
  // agar server tidak looping selamanya jika ada error
  const maxPagesToFetch = 5; 

  while (
    filteredAnimes.length < desiredLimit && 
    hasNextPage && 
    currentPage <= maxPagesToFetch
  ) {
    try {
      const response = await fetch(`${baseUrl}/${endpoint}?page=${currentPage}`);
      
      if (!response.ok) {
        console.error(`Gagal fetch ${endpoint} page ${currentPage}: Status ${response.status}`);
        hasNextPage = false; // Hentikan loop jika halaman gagal di-fetch
        continue; // Lanjut ke iterasi loop berikutnya (yang akan gagal)
      }

      const data = await response.json();
      const animesOnThisPage = data.animes || [];

      // Filter anime di halaman ini
      const validAnimes = animesOnThisPage.filter(anime => 
        validTypes.includes(anime.type)
      );

      // Tambahkan hasil filter ke array utama
      // Kita gunakan 'push' dan 'slice' di akhir agar lebih efisien
      for (const anime of validAnimes) {
        if (filteredAnimes.length < desiredLimit) {
          filteredAnimes.push(anime);
        } else {
          break; // Hentikan jika 'desiredLimit' sudah tercapai
        }
      }

      // Perbarui status pagination
      hasNextPage = data.pagination?.hasNext || false;
      currentPage++;

    } catch (error) {
      console.error(`Error saat processing ${endpoint} page ${currentPage}:`, error);
      hasNextPage = false; // Hentikan loop jika ada error parsing JSON, dll.
    }
  }

  // Kembalikan array yang sudah terisi dan terpotong
  return filteredAnimes;
}
// --- AKHIR FUNGSI HELPER BARU ---


// Komponen Home Anda (sudah async)
const Home = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const user = await AuthUserSession();

  let animeOngoing = [];
  let animeComplete = [];
  let ongoingFetchFailed = false;
  let completedFetchFailed = false;

  // MODIFIKASI: Gunakan Promise.allSettled dengan fungsi helper baru
  // Ini akan fetch 'ongoing' dan 'completed' secara paralel,
  // dan masing-masing akan melakukan looping fetch internal jika diperlukan.
  try {
    const [ongoingResult, completedResult] = await Promise.allSettled([
      fetchAndFilterAnime(apiUrl, 'ongoing', 10), // Ambil 10 item TV/Movie
      fetchAndFilterAnime(apiUrl, 'completed', 10) // Ambil 10 item TV/Movie
    ]);

    if (ongoingResult.status === 'fulfilled') {
      animeOngoing = ongoingResult.value;
      // Anggap gagal hanya jika hasil fetch = 0
      if (animeOngoing.length === 0) ongoingFetchFailed = true; 
    } else {
      console.error("Fetch ongoing gagal:", ongoingResult.reason);
      ongoingFetchFailed = true;
    }

    if (completedResult.status === 'fulfilled') {
      animeComplete = completedResult.value;
      // Anggap gagal hanya jika hasil fetch = 0
      if (animeComplete.length === 0) completedFetchFailed = true; 
    } else {
      console.error("Fetch completed gagal:", completedResult.reason);
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
      <Navbar user={user} />
      <HeroSection />

      <Header title="Anime OnGoing" />
      {/* Jika fetch 0 item (walau sukses), tampilkan warning.
        Jika fetch gagal (error), tampilkan warning.
      */}
      {ongoingFetchFailed ? (
        <ApiWarningMessage sectionTitle="OnGoing" />
      ) : (
        <AnimeOngoing api={animeOngoing} />
      )}

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