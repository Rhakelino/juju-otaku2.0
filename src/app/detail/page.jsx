export const dynamic = 'force-dynamic';

import React from 'react';
import AnimeListClient from '../components/AnimeListClient';
import Navigation from '../components/Navigation';

// Server Component
const Page = async () => {

    async function getAllAnime() {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            // Pastikan URL sudah benar
            const response = await fetch(`${apiUrl}/animelist?letter=A&page=1`, { 
                cache: 'no-store' // Opsional: Untuk memastikan data selalu baru
            }); 
            
            if (!response.ok) {
                throw new Error(`Gagal mengambil data: ${response.status}`);
            }
            
            const result = await response.json();
            // Kita kembalikan array list utama
            console.log(result)
            return result.animes; 
            
        } catch (error) {
            console.error("Gagal mengambil data anime:", error);
            return []; // Kembalikan array kosong jika gagal
        }
    }
    
    // Ambil data dari server
    const allAnimeData = await getAllAnime(); 
    
    // Meratakan array of objects menjadi satu array judul anime
    const flattenedAnimeList = allAnimeData.flatMap(group => 
        group.animeList.map(anime => ({
            title: anime.title,
            href: anime.href
        }))
    );

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-4 md:p-8">
            <Navigation />
            <h1 className="text-3xl font-bold mb-8 text-center text-pink-500">
                Daftar Semua Anime A - Z
            </h1>
            <AnimeListClient initialData={flattenedAnimeList} />
        </div>
    );
}

export default Page;