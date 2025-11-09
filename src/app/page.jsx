"use client"; // <-- INI KUNCINYA: Mengubah ke Client Component

import React, { useState, useEffect } from 'react'; // Impor hook
import AnimeCompleted from "@/app/components/AnimeCompleted";
import AnimeOngoing from "@/app/components/AnimeOngoing";
import Header from "@/app/components/Header";
import HeroSection from "@/app/components/HeroSection";

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


export default function Home() {
  // --- STATE UNTUK DATA ---
  const [animeOngoing, setAnimeOngoing] = useState([]);
  const [animeComplete, setAnimeComplete] = useState([]);
  
  // --- STATE UNTUK STATUS LOADING ---
  const [isLoadingOngoing, setIsLoadingOngoing] = useState(true);
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(true);
  const [ongoingFetchFailed, setOngoingFetchFailed] = useState(false);
  const [completedFetchFailed, setCompletedFetchFailed] = useState(false);

  // --- PINDAHKAN LOGIKA FETCH KE useEffect ---
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // 1. Fungsi untuk fetch Ongoing
    async function fetchOngoing() {
      setIsLoadingOngoing(true);
      setOngoingFetchFailed(false);
      try {
        const response = await fetch(`${apiUrl}/ongoing`);
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`);
        }
        const result = await response.json();
        setAnimeOngoing(result.animes || []);
      } catch (error) {
        console.error("Gagal mengambil data OnGoing:", error);
        setOngoingFetchFailed(true);
      } finally {
        setIsLoadingOngoing(false);
      }
    }

    // 2. Fungsi untuk fetch Completed
    async function fetchCompleted() {
      setIsLoadingCompleted(true);
      setCompletedFetchFailed(false);
      try {
        const response = await fetch(`${apiUrl}/completed`);
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`);
        }
        const result = await response.json();
        setAnimeComplete(result.animes || []);
      } catch (error) {
        console.error("Gagal mengambil data Completed:", error);
        setCompletedFetchFailed(true);
      } finally {
        setIsLoadingCompleted(false);
      }
    }

    // 3. Panggil kedua fungsi
    // Kita tidak pakai Promise.all agar 'Ongoing' bisa tampil
    // meskipun 'Completed' masih loading
    fetchOngoing();
    fetchCompleted();

  }, []); // [] = Hanya jalankan sekali saat komponen dimuat

  // 4. Render halaman. 
  return (
    <>
      <HeroSection />
      
      <Header title="Anime OnGoing" />
      {/* --- LOGIKA RENDER BARU (CLIENT) --- */}
      {isLoadingOngoing ? (
        // 1. Tampilkan Skeleton saat loading
        <AnimeListSkeleton />
      ) : ongoingFetchFailed ? (
        // 2. Tampilkan Warning jika gagal
        <ApiWarningMessage sectionTitle="OnGoing" />
      ) : (
        // 3. Tampilkan data jika berhasil
        <AnimeOngoing api={animeOngoing}/>
      )}
      {/* --- AKHIR LOGIKA RENDER --- */}

      <Header title="Anime Completed" />
      {/* --- LOGIKA RENDER BARU (CLIENT) --- */}
      {isLoadingCompleted ? (
        // 1. Tampilkan Skeleton saat loading
        <AnimeListSkeleton />
      ) : completedFetchFailed ? (
        // 2. Tampilkan Warning jika gagal
        <ApiWarningMessage sectionTitle="Completed" />
      ) : (
        // 3. Tampilkan data jika berhasil
        <AnimeCompleted api={animeComplete}/>
      )}
      {/* --- AKHIR LOGIKA RENDER --- */}
    </>
  );
}