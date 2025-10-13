import Image from 'next/image';
import Link from 'next/link';

// --- FUNGSI DIPERBARUI ---
async function getHighQualityImage(japaneseTitle) {


  // 2. Jika judul utama gagal, coba dengan judul Jepang
  if (japaneseTitle) {
    try {
      const jikanResponse = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(japaneseTitle)}&limit=1`);
      if (jikanResponse.ok) {
        const jikanResult = await jikanResponse.json();
        const imageUrl = jikanResult.data?.[0]?.images?.jpg?.large_image_url;
        if (imageUrl) return imageUrl; // Jika berhasil, kembalikan
      }
    } catch (error) {
      console.error("Jikan API error (japanese_title):", error);
    }
  }

  // 3. Jika semua gagal, kembalikan null
  return null;
}

async function getDetailAnime(slug) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/anime/${slug}`);
    if (!response.ok) {
      throw new Error('Gagal mengambil data anime utama');
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Gagal mengambil detail anime:", error);
    return null;
  }
}

export default async function DetailAnimePage({ params }) {
  const { slug } = params;
  
  const animeData = await getDetailAnime(slug);

  if (!animeData) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex flex-col justify-center items-center text-center">
        <h1 className="text-2xl font-bold text-red-500">Anime Tidak Ditemukan</h1>
        <p className="text-neutral-400 mt-2">Data untuk anime ini tidak dapat dimuat.</p>
        <Link href="/" className="mt-6 bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // --- LOGIKA DIPERBARUI ---
  const highQualityImage = await getHighQualityImage(animeData.japanese_title);

  const anime = {
    ...animeData,
    poster: highQualityImage || animeData.poster,
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Background Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm opacity-30"
        style={{ backgroundImage: `url(${anime.poster})` }}
      ></div>

      {/* Konten Utama */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:flex">
        {/* Poster */}
        <div className="md:w-1/3 justify-center flex mb-6 md:mb-0 md:pr-8 flex-shrink-0">
          <Image
            src={anime.poster}
            alt={anime.title}
            className="object-cover rounded-lg shadow-xl"
            width={400}
            height={600}
            priority
          />
        </div>

        {/* Detail Informasi */}
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-4">{anime.title}</h1>
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-neutral-400">TV • {anime.duration || '24m'}</span>
          </div>
          <div className="flex space-x-4 mb-6">
            <Link
              href={`/watch/${anime.episode_lists?.[0]?.slug || ''}`}
              className="bg-pink-600 text-white px-6 py-2 rounded-full flex items-center space-x-2 hover:bg-pink-700 transition"
            >
              Watch Now
            </Link>
            {anime.batch && anime.batch.slug && (
               <Link
                href={`/download/${anime.batch.slug}`}
                className="bg-blue-600 text-white px-6 py-2 rounded-full flex items-center space-x-2 hover:bg-blue-700 transition"
              >
                Download Batch
              </Link>
            )}
          </div>
          <div className='flex flex-col mb-4 overflow-hidden'>
            <p className="text-neutral-300">
              {anime.synopsis || 'Tidak ada sinopsis tersedia.'}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-neutral-400">
            <div>
              <span className="font-semibold text-white block">Japanese</span>
              {anime.japanese_title || 'N/A'}
            </div>
            <div>
              <span className="font-semibold text-white block">Producer</span>
              {anime.produser || 'N/A'}
            </div>
            <div>
              <span className="font-semibold text-white block">Rating</span>
              {anime.rating || 'N/A'}
            </div>
            <div>
              <span className="font-semibold text-white block">Release Date</span>
              {anime.release_date || 'N/A'}
            </div>
            <div>
              <span className="font-semibold text-white block">Studio</span>
              {anime.studio || 'N/A'}
            </div>
            <div>
              <span className="font-semibold text-white block">Status</span>
              {anime.status || 'N/A'}
            </div>
          </div>
          <div className="mt-4">
            <span className="font-semibold text-white block mb-2">Genres</span>
            <div className="flex flex-wrap gap-2">
              {anime.genres?.map((genre) => (
                <span key={genre.slug} className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* EPISODE LIST */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 py-8">
        <h2 className="text-2xl font-bold mb-4">Episodes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {anime.episode_lists && anime.episode_lists.length > 0 ? (
            anime.episode_lists.map((episode) => (
              <Link
                key={episode.slug}
                href={`/watch/${episode.slug}`}
                className="bg-neutral-800 rounded-lg p-4 flex items-center space-x-4 hover:bg-neutral-700 transition"
              >
                <div className="w-24 h-12 bg-neutral-700 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-500 font-bold">EP {episode.episode_number}</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold line-clamp-1">
                    {episode.episode || `Episode ${episode.episode_number}`}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {anime.duration || 'Unknown duration'}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-neutral-400 py-8">
              {'No episodes available for this anime yet.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}