"use client";

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { FaEye, FaStar } from 'react-icons/fa' 

// Ganti nama prop 'rating' menjadi 'ratingProp' untuk menghindari konflik
const AnimeCard = ({ title, image, slug, currentEpisode, rating: ratingProp, views, episodeCount }) => {

  const [episodeText, setEpisodeText] = useState(null);
  const [rating, setRating] = useState(ratingProp || null); // State untuk rating

  useEffect(() => {
    async function fetchMissingData() {
      // (Fungsi fetch ini hanya akan dipanggil jika perlu)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      try {
        const response = await fetch(`${apiUrl}/anime/${slug}`);
        if (!response.ok) throw new Error('Gagal fetch detail');
        
        const result = await response.json();
        
        if (result.data) {
          // 1. Set Teks Episode (hanya jika tidak ada)
          if (!currentEpisode && !episodeCount && result.data.episode_count) {
            setEpisodeText(`Eps ${result.data.episode_count}`);
          }
          // 2. Set Rating (hanya jika tidak ada)
          if (!ratingProp && result.data.rating) {
            setRating(result.data.rating);
          }
        } else {
          if (!currentEpisode && !episodeCount) setEpisodeText('Eps N/A');
        }
      } catch (error) {
        console.error(`Gagal mengambil data untuk ${slug}:`, error);
      }
    }

    // --- LOGIKA UTAMA YANG BARU (LEBIH PINTAR) ---

    // 1. Logika untuk Teks Episode
    if (currentEpisode) {
      // Ini anime ONGOING, langsung set teks-nya
      setEpisodeText(currentEpisode.replace('Eps:', 'Eps ')); 
    } else if (episodeCount) {
      // Ini anime COMPLETED, langsung set teks-nya
      setEpisodeText(`Eps ${episodeCount}`);
    } else if (slug) {
      // Ini dari SEARCH/LIST, panggil fetch untuk episode
      fetchMissingData(); 
    }

    // 2. Logika untuk Rating
    if (ratingProp) {
      // Ini anime COMPLETED (dapat data dari prop), langsung set
      setRating(ratingProp);
    } else if (slug && !currentEpisode) {
      // Ini BUKAN anime ongoing (misal dari SEARCH/LIST)
      // JADI, kita panggil fetch untuk rating
      fetchMissingData();
    }
    
    // JIKA INI ANIME ONGOING (currentEpisode ada) DAN ratingProp TIDAK ADA,
    // kita tidak melakukan apa-apa. 'rating' akan tetap 'null'.
    // INI ADALAH KUNCI PERBAIKAN PERFORMA ANDA.

  }, [slug, currentEpisode, episodeCount, ratingProp]);

  return (
    <Link
      key={slug}
      href={`/anime/${slug}`}
      className="group"
    >
      <div className="flex flex-col h-full">
        
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={title}
            fill // Gunakan fill
            // Hapus priority, width, dan height
            sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105 bg-neutral-700"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

          {/* Badge Rating ini sekarang TIDAK akan render untuk ONGOING */}
          {rating && (
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-bold text-yellow-400 backdrop-blur-sm">
              <FaStar />
              <span>{rating}</span>
            </div>
          )}

          {/* Badge Episode */}
          {episodeText && (
            <div className="absolute bottom-2 left-2 z-10 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {episodeText}
            </div>
          )}
        </div>

        <div className="mt-2 px-1">
          <h3 className="font-semibold text-sm text-white line-clamp-2 group-hover:text-pink-400 transition-colors">
            {title}
          </h3>
          {!rating && currentEpisode && (
             <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
              <span>Update setiap {views}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default AnimeCard