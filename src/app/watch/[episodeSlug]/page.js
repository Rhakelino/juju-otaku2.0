'use client'; // <-- Tandai sebagai Client Component untuk interaktivitas

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlayCircleIcon } from '@heroicons/react/24/solid';

// --- DIUBAH: Komponen LoadingSpinner diganti dengan Skeleton ---
function WatchPageSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white animate-pulse">
      <div className="container mx-auto px-4 py-8">
        
        {/* Placeholder untuk Video Player */}
        <div className="aspect-video bg-slate-800 rounded-lg mb-4 shadow-lg"></div>

        {/* Placeholder untuk Pemilih Server */}
        <div className="bg-slate-900/50 p-4 rounded-lg mb-4">
            <div className="h-7 w-48 bg-slate-700 rounded mb-3"></div>
            <div className="flex flex-wrap gap-2">
              {/* Menampilkan beberapa placeholder tombol server */}
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="h-9 w-28 bg-slate-700 rounded-md"></div>
              ))}
            </div>
        </div>

        {/* Placeholder untuk Judul dan Navigasi Episode */}
        <div className="bg-slate-900/50 p-4 rounded-lg mb-8">
          <div className="h-8 w-3/4 bg-slate-700 rounded mb-2"></div>
          <div className="flex justify-between items-center">
            <div className="h-5 w-44 bg-slate-700 rounded"></div>
            <div className="flex space-x-2">
              <div className="h-10 w-10 bg-slate-700 rounded-full"></div>
              <div className="h-10 w-10 bg-slate-700 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Placeholder untuk Daftar Download */}
        <div className="bg-slate-900/50 p-4 rounded-lg">
           <div className="h-8 w-40 bg-slate-700 border-b-2 border-slate-700 pb-2 mb-4 rounded"></div>
           {/* Placeholder untuk satu grup format (misal: MP4) */}
           <div className="mb-4">
             <div className="h-7 w-16 bg-slate-700 rounded mb-2"></div>
             <div className="bg-slate-800 rounded-lg p-3 mb-3">
               <div className="h-5 w-20 bg-slate-700 rounded mb-2"></div>
               <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="h-7 w-24 bg-slate-700 rounded-md"></div>
                  ))}
               </div>
             </div>
             <div className="bg-slate-800 rounded-lg p-3 mb-3">
               <div className="h-5 w-20 bg-slate-700 rounded mb-2"></div>
               <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="h-7 w-24 bg-slate-700 rounded-md"></div>
                  ))}
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}

// Komponen 'Error' sederhana
function ErrorDisplay({ message, animeSlug }) {
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-2xl font-bold mb-4 text-red-500">Terjadi Kesalahan</h1>
      <p className="text-neutral-400 mb-8">{message}</p>
      {animeSlug ? (
         <Link href={`/anime/${animeSlug}`} className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition">
          Kembali ke Halaman Anime
        </Link>
      ) : (
         <Link href="/" className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition">
          Kembali ke Beranda
        </Link>
      )}
    </div>
  );
}

export default function WatchPage({ params }) {
  const { episodeSlug } = params;
  
  // State untuk menyimpan data episode, status loading, dan error
  const [episodeData, setEpisodeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Mengambil data saat komponen dimuat atau saat episodeSlug berubah
  useEffect(() => {
    async function fetchEpisodeData() {
      setIsLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/episode/${episodeSlug}`);
        if (!response.ok) {
          throw new Error(`Gagal mengambil data. Status: ${response.status}`);
        }
        const result = await response.json();
        setEpisodeData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEpisodeData();
  }, [episodeSlug]);

  if (isLoading) {
    // --- DIUBAH: Menampilkan skeleton loading ---
    return <WatchPageSkeleton />;
  }

  if (error) {
    return <ErrorDisplay message={error} animeSlug={episodeData?.anime?.slug} />;
  }

  if (!episodeData) {
    return <ErrorDisplay message="Data episode tidak ditemukan." />;
  }

  // Mengumpulkan semua opsi resolusi DAN FORMATNYA
  const qualityOptions = [];
  if (episodeData.download_urls) {
    for (const format in episodeData.download_urls) {
      episodeData.download_urls[format].forEach(quality => {
        if (quality.urls) {
          quality.urls.forEach(providerUrl => {
            qualityOptions.push({
              format: format,
              resolution: quality.resolution,
              url: providerUrl.url,
              provider: providerUrl.provider,
            });
          });
        }
      });
    }
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        
        {/* Player sekarang aktif dan memutar stream_url default */}
        <div className="aspect-video bg-neutral-800 rounded-lg overflow-hidden mb-4 shadow-lg">
          {episodeData.stream_url ? (
            <iframe
              src={episodeData.stream_url}
              allowFullScreen
              scrolling="no"
              className="w-full h-full border-0"
            ></iframe>
          ) : (
             <div className="w-full h-full flex flex-col justify-center items-center text-center p-4 bg-neutral-900">
                <PlayCircleIcon className="h-16 w-16 text-pink-500 mb-4"/>
                <h2 className="text-xl font-bold">Server Default Tidak Tersedia</h2>
                <p className="text-neutral-400">Silakan pilih server lain di bawah.</p>
            </div>
          )}
        </div>

        {/* Pemilih Server (tetap membuka tab baru) */}
        <div className="bg-neutral-900 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-semibold mb-3">Pilih Server Lain (Tab Baru)</h2>
            <div className="flex flex-wrap gap-2">
                {qualityOptions.map((option) => {
                    const identifier = `${option.format}-${option.resolution}-${option.provider}`;
                    return (
                        <a 
                            key={identifier}
                            href={option.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-neutral-700 px-4 py-2 text-sm rounded-md transition hover:bg-neutral-600">
                            {option.resolution} ({option.provider}) <span className="uppercase text-xs ml-1 opacity-70">{option.format}</span>
                        </a>
                    )
                })}
            </div>
        </div>

        {/* Judul dan Navigasi Episode */}
        <div className="bg-neutral-900 p-4 rounded-lg mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 truncate">{episodeData.episode}</h1>
          <div className="flex justify-between items-center">
            {episodeData.anime && episodeData.anime.slug && (
              <Link href={`/anime/${episodeData.anime.slug}`} className="text-sm text-pink-400 hover:underline">
                Kembali ke detail anime
              </Link>
            )}
            <div className="flex space-x-2">
              {episodeData.has_previous_episode && episodeData.previous_episode && (
                <Link href={`/watch/${episodeData.previous_episode.slug}`} className="bg-neutral-700 p-2 rounded-full hover:bg-pink-600 transition">
                  <ChevronLeftIcon className="h-6 w-6" />
                </Link>
              )}
              {episodeData.has_next_episode && episodeData.next_episode && (
                <Link href={`/watch/${episodeData.next_episode.slug}`} className="bg-neutral-700 p-2 rounded-full hover:bg-pink-600 transition">
                  <ChevronRightIcon className="h-6 w-6" />
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Daftar Download */}
        <div className="bg-neutral-900 p-4 rounded-lg">
           <h2 className="text-xl font-semibold text-pink-500 border-b-2 border-neutral-700 pb-2 mb-4">
            Download Links
          </h2>
          {episodeData.download_urls && Object.keys(episodeData.download_urls).length > 0 ? (
             Object.keys(episodeData.download_urls).map((format) => (
                <div key={format} className="mb-4">
                  <h3 className="font-bold text-lg uppercase text-neutral-300 mb-2">{format}</h3>
                  {episodeData.download_urls[format].map((download, downloadIndex) => (
                     <div key={downloadIndex} className="bg-neutral-800 rounded-lg p-3 mb-3">
                       <p className="font-semibold text-white mb-2">{download.resolution}</p>
                       <div className="flex flex-wrap gap-2">
                         {download.urls.map((link) => (
                           <a
                            key={link.provider}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700 transition"
                           >
                             {link.provider}
                           </a>
                         ))}
                       </div>
                     </div>
                  ))}
                </div>
              ))
          ) : (
            <p className="text-neutral-500">Tidak ada link download tersedia.</p>
          )}
        </div>
      </div>
    </div>
  );
}

