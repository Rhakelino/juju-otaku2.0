"use client";

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
// Kita butuh ikon baru untuk rating (bintang) dan views (mata)
// Pastikan Anda sudah install: npm install react-icons
import { FaEye, FaStar } from 'react-icons/fa' 

const AnimeCard = ({ title, image, slug, currentEpisode, rating, views, episodeCount }) => {

  const [episodeText, setEpisodeText] = useState(null);

  // Bagian 'useEffect' ini sudah bagus, tidak perlu diubah.
  // Ini menangani pengambilan 'episode_count' jika 'currentEpisode' tidak ada.
  useEffect(() => {
    async function fetchEpisodeCount() {
      // Saya ubah formatnya sedikit agar cocok dengan screenshot ("Eps 12")
      setEpisodeText('Eps ?'); 
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      try {
        const response = await fetch(`${apiUrl}/anime/${slug}`);
        if (!response.ok) throw new Error('Gagal fetch detail');
        
        const result = await response.json();
        
        if (result.data && result.data.episode_count) {
          setEpisodeText(`Eps ${result.data.episode_count}`);
        } else {
          setEpisodeText('Eps N/A');
        }
      } catch (error) {
        console.error(`Gagal mengambil episode count untuk ${slug}:`, error);
      }
    }

    if (currentEpisode) {
      setEpisodeText(currentEpisode); // Misal: "Eps 13"
    } else if (episodeCount) {
      setEpisodeText(`Eps ${episodeCount}`);
    } else if (slug) {
      fetchEpisodeCount();
    }

  }, [slug, currentEpisode, episodeCount]);

  // --- JSX (TAMPILAN) KITA UBAH TOTAL DI SINI ---
  return (
    <Link
      key={slug}
      href={`/anime/${slug}`}
      className="group"
    >
      {/* 1. Container Kartu: Tanpa bg, border, atau shadow */}
      <div className="flex flex-col h-full">
        
        {/* 2. Container Gambar: Rasio 2:3 dan rounded */}
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={title}
            fill
            priority
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Gradient overlay dari bawah untuk keterbacaan teks */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

          {/* 3. Badge Rating (BARU) - Kanan Atas */}
          {rating && (
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-bold text-yellow-400 backdrop-blur-sm">
              <FaStar />
              <span>{rating}</span>
            </div>
          )}

          {/* 4. Badge Episode (PINDAH) - Kiri Bawah */}
          {episodeText && (
            <div className="absolute bottom-2 left-2 z-10 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {/* Mengganti "Eps:" menjadi "Eps " agar cocok */}
              {episodeText.replace('Eps:', 'Eps ')}
            </div>
          )}
        </div>

        {/* 5. Konten Teks di Bawah Gambar */}
        <div className="mt-2 px-1">
          {/* Judul Anime */}
          <h3 className="font-semibold text-sm text-white line-clamp-2 group-hover:text-pink-400 transition-colors">
            {title}
          </h3>
          
          {/* 6. Info Views (BARU) */}
          {views && (
            <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
              <FaEye />
              <span>{views} views</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default AnimeCard