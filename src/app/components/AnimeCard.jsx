"use client";

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { FaEye, FaStar } from 'react-icons/fa' 

// --- UBAH PROPS: Hapus 'rating' dan ganti jadi 'ratingProp' ---
// Ini untuk menghindari konflik nama dengan state
const AnimeCard = ({ title, image, slug, currentEpisode, rating: ratingProp, views, episodeCount }) => {

  const [episodeText, setEpisodeText] = useState(null);
  // --- TAMBAHKAN STATE UNTUK RATING ---
  const [rating, setRating] = useState(ratingProp || null);

  useEffect(() => {
    async function fetchEpisodeCount() {
      setEpisodeText('Eps ?'); 
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      try {
        const response = await fetch(`${apiUrl}/anime/${slug}`);
        if (!response.ok) throw new Error('Gagal fetch detail');
        
        const result = await response.json();
        
        // Cek apakah data ada
        if (result.data) {
          // Hanya update jika prop tidak ada
          if (!currentEpisode && !episodeCount && result.data.episode_count) {
            setEpisodeText(`Eps ${result.data.episode_count}`);
          }
          // --- TAMBAHKAN LOGIKA FETCH RATING ---
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

    if (currentEpisode) {
      setEpisodeText(currentEpisode.replace('Eps:', 'Eps ')); 
    } else if (episodeCount) {
      setEpisodeText(`Eps ${episodeCount}`);
    } else if (slug) {
      // Hanya fetch jika episode atau rating tidak ada
      if (!currentEpisode && !episodeCount || !ratingProp) {
        fetchEpisodeCount();
      }
    }
    // Pastikan ratingProp di-set ke state
    if (ratingProp) {
      setRating(ratingProp);
    }

  }, [slug, currentEpisode, episodeCount, ratingProp]); // Tambahkan ratingProp di dependency

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
            fill            
            sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105 bg-neutral-700"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

          {/* Gunakan state 'rating' */}
          {rating && (
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-bold text-yellow-400 backdrop-blur-sm">
              <FaStar />
              <span>{rating}</span>
            </div>
          )}

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