import React from 'react';
import Navigation from '@/app/components/Navigation';
import ResponsiveBreadcrumb from '@/app/components/ResponsiveBreadcrumb';
import Header from '@/app/components/Header';
import AnimeCard from '@/app/components/AnimeCard';
import PaginationControls from '@/app/components/Pagination';
import Link from 'next/link';

async function getAnimeByGenre(slug, page = 1) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/genre/${slug}?page=${page}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error('Gagal mengambil data anime');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching anime by genre:", error);
    return { animes: [], pagination: { hasNext: false, hasPrev: false } };
  }
}

async function getGenres() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/genres`, {
      next: { revalidate: 86400 }
    });
    
    if (!response.ok) {
      return [];
    }
    
    const result = await response.json();
    return result.genres || [];
  } catch (error) {
    return [];
  }
}

export default async function GenrePage({ params: paramsPromise, searchParams }) {
  const params = await paramsPromise;
  const { slug } = params;
  const currentPage = parseInt(searchParams.page) || 1;

  const [result, allGenres] = await Promise.all([
    getAnimeByGenre(slug, currentPage),
    getGenres()
  ]);

  const animes = result.animes || [];
  const hasNextPage = result.pagination?.hasNext || false;

  // Find genre name from slug
  const currentGenre = allGenres.find(g => g.slug === slug);
  const genreName = currentGenre?.name || slug;

  const breadcrumbs = [
    { title: 'Genres', href: '/genres' },
    { title: genreName, href: `/genre/${slug}` }
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <ResponsiveBreadcrumb crumbs={breadcrumbs} />
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <Header title={`Genre: ${genreName}`} />
          <Link
            href="/genres"
            className="inline-flex items-center text-pink-400 hover:text-pink-500 transition-colors text-sm sm:text-base"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Kembali ke Genres
          </Link>
        </div>

        {animes.length > 0 ? (
          <>
            <p className="text-neutral-400 mb-6">
              Halaman {currentPage} - Menampilkan {animes.length} anime
            </p>

            {/* Anime Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 my-8 gap-4 md:gap-6">
              {animes.map((anime, index) => (
                <AnimeCard
                  key={anime.slug || index}
                  title={anime.title}
                  image={anime.poster}
                  slug={anime.slug}
                  type={anime.type}
                  episode={anime.episode}
                  statusOrDay={anime.status_or_day}
                  priority={index < 10}
                />
              ))}
            </div>

            {/* Pagination */}
            <PaginationControls
              currentPage={currentPage}
              hasNextPage={hasNextPage}
            />
          </>
        ) : (
          <div className="flex flex-col justify-center items-center min-h-[50vh]">
            <p className="text-neutral-400 text-lg mb-4">
              {currentPage > 1 
                ? "Tidak ada anime di halaman ini." 
                : "Belum ada anime untuk genre ini."}
            </p>
            {currentPage > 1 && (
              <Link
                href={`/genre/${slug}`}
                className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition"
              >
                Kembali ke Halaman 1
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
