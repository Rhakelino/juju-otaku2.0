import React from 'react';
import Header from '@/app/components/Header';
import AnimeCard from '@/app/components/AnimeCard';
import PaginationControls from '../components/Pagination';
import Navigation from '../components/Navigation';

// Sesuaikan angka ini jika API Anda mengembalikan jumlah yang berbeda (misal 12, 24).
const ANIME_PER_PAGE = 10;

async function getPopularAnime(page = 1) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(
      `${apiUrl}/popular?page=${page}`,
      { next: { revalidate: 3600 } } // Cache data selama 1 jam
    );


    if (!response.ok) {
      throw new Error("Gagal mengambil data populer");
    }

    const result = await response.json();
    console.log(result)
    // Berdasarkan JSON Anda, data ada di 'result.data.animes'
    return result.animes || [];
  } catch (error) {
    console.error("Error fetching popular anime:", error);
    return []; // Kembalikan array kosong jika terjadi error
  }
}

/**
 * Halaman Populer (Server Component)
 * searchParams akan otomatis diisi oleh Next.js (cth: { page: '1' })
 */
export default async function PopulerPage({ searchParams }) {

  // Ambil nomor halaman dari URL, default ke 1 jika tidak ada
  const currentPage = parseInt(searchParams.page) || 1;

  // Panggil API untuk mendapatkan data halaman saat ini
  const popularAnime = await getPopularAnime(currentPage);

  const hasNextPage = popularAnime.length === ANIME_PER_PAGE;

  return (
    <div className="container mx-auto px-4 py-8">
      <Navigation />
      <Header title={`Anime Populer #${currentPage}`} />
      {popularAnime.length > 0 ? (
        <>
          {/* Grid untuk menampilkan anime */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 my-8 gap-4 md:gap-6">
            {popularAnime.map((anime, index) => (
              <AnimeCard
                key={anime.slug || index} // Gunakan slug sebagai key
                title={anime.title}
                image={anime.poster}
                slug={anime.slug}
                // Berdasarkan JSON Anda:
                type={anime.type} // cth: "24 Episode"
                episode={anime.episode}
                statusOrDay={anime.status_or_day} // cth: "Selesai ✓"
                priority={index < 10} // Optimasi loading 10 gambar pertama
              />
            ))}
          </div>

          {/* Kontrol Paginasi */}
          <PaginationControls
            currentPage={currentPage}
            hasNextPage={hasNextPage}
          />
        </>
      ) : (
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-neutral-400">
            {currentPage > 1 ? "Gagal memuat halaman ini atau halaman tidak ada." : "Gagal memuat anime populer."}
          </p>
        </div>
      )}
    </div>
  );
}