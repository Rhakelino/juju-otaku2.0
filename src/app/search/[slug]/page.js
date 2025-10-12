import AnimeCard from '@/app/components/AnimeCard';
import Link from 'next/link';
// PASTIKAN PATH INI SESUAI DENGAN LOKASI AnimeCard ANDA

async function searchAnime(slug) {
  // Jika tidak ada slug, jangan panggil API
  if (!slug) {
    return [];
  }
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    // URL disesuaikan dengan format /search/{slug}
    // Ingat, /anime sudah ada di dalam apiUrl dari .env
    const searchUrl = `${apiUrl}/search/${slug}`;

    const response = await fetch(searchUrl, {
      headers: {
        // Menambahkan header lengkap untuk meniru Postman/browser
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.sankavollerei.com/' 
      }
    });
    
    if (!response.ok) {
      console.error(`API error for slug "${slug}": Status ${response.status}`);
      return [];
    }

    const result = await response.json();
    // Menggunakan kunci data yang benar: search_results
    return result.search_results || []; 
  } catch (error) {
    console.error("Gagal total saat mengambil hasil pencarian:", error);
    return [];
  }
}

// Komponen menerima `params` dari folder [slug]
export default async function SearchPage({ params }) {
  const { slug } = params; 
  // Membersihkan slug dari format URL agar bisa dibaca di judul
  const keyword = decodeURIComponent(slug); 
  // Kirim slug yang masih ter-encode ke API
  const searchResults = await searchAnime(slug); 

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
           <Link href="/" className="text-pink-400 hover:underline mb-4 inline-block">&larr; Kembali ke Beranda</Link>
          <h1 className="text-3xl md:text-4xl font-bold">
            Hasil Pencarian untuk: <span className="text-pink-500">"{keyword}"</span>
          </h1>
        </div>

        {searchResults && searchResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {searchResults.map((anime) => {
              // --- PERBAIKAN DI SINI ---
              // Mengambil bagian terakhir dari URL slug yang diberikan oleh API
              const slugParts = anime.slug.split('/').filter(Boolean);
              const processedSlug = slugParts.pop() || ''; // .pop() mengambil elemen terakhir

              return (
                <AnimeCard
                  key={processedSlug || anime.title}
                  slug={processedSlug} // <-- Gunakan slug yang sudah bersih
                  title={anime.title}
                  image={anime.poster}
                  // Menyesuaikan props dengan data dari API pencarian
                  releaseDay={anime.status || 'N/A'}
                  currentEpisode={`Eps: ${anime.episode_count || '?'}`}
                  newestReleaseDate={anime.release_date ? anime.release_date.split(',')[0] : null}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-neutral-400">Yah, tidak ketemu...</h2>
            <p className="text-neutral-500 mt-2">
              Tidak ada hasil ditemukan untuk pencarian "{keyword}". Coba kata kunci lain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}