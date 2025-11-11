export const dynamic = 'force-dynamic'

import Navigation from '@/app/components/Navigation';
import Image from 'next/image';
import Link from 'next/link';

// Fungsi Fetch (Tidak berubah, ini sudah benar)
async function getDetailAnime(slug) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/detail/${slug}`);
    if (!response.ok) {
      throw new Error('Gagal mengambil data anime utama (API baru)');
    }
    const result = await response.json();
    return result.detail;
  } catch (error) {
    console.error("Gagal mengambil detail anime:", error);
    return null;
  }
}

export default async function DetailAnimePage({ params: paramsPromise }) {
  const params = await paramsPromise;
  const { slug } = params; // Ini adalah slug yang "bersih", cth: "one-punch-man-s3"

  const anime = await getDetailAnime(slug);

  if (!anime) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex flex-col justify-center items-center text-center">
        <h1 className="text-2xl font-bold text-red-500">Anime Tidak Ditemukan</h1>
        <p className="text-neutral-400 mt-2">Data untuk anime ini tidak dapat dimuat.</p>
        <Navigation />
      </div>
    );
  }

  // --- PERBAIKAN: Ambil info langsung dari root 'anime' (data 'detail') ---
  const duration = anime.duration || 'N/A';
  const producer = anime.author || 'N/A';
  const season = anime.season || 'N/A';
  const releaseDate = anime.aired || 'N/A';
  const studio = anime.studio || 'N/A';
  const japaneseTitle = anime.synonym || 'N/A';
  const status = anime.status || 'N/A';

  // --- LOGIKA BARU: Siapkan Query Params untuk Halaman Nonton ---
  // Kita akan mengirimkan data ini ke /watch page melalui URL
  const historyQueryParams = new URLSearchParams({
    slug: slug,             // Slug bersih, cth: "one-punch-man-s3"
    title: anime.title,     // Judul anime, cth: "One Punch Man S3"
    image: anime.poster,    // URL Poster
  });
  const queryString = historyQueryParams.toString();
  // Hasil: "slug=one-punch-man-s3&title=One+Punch+Man+S3&image=http%3A%2F%2F..."
  // -------------------------------------------------------------

  return (

    <div className="relative min-h-screen bg-neutral-900 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm opacity-30"
        style={{ backgroundImage: `url(${anime.poster})` }}
      ></div>
      <div className="relative z-10 container mx-auto px-4 py-8">
        <Navigation />
        <div className="md:flex mt-8">
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
          <div className="md:w-2/3">
            <h1 className="text-4xl font-bold mb-4">{anime.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-neutral-400">{status} • {duration}</span>
            </div>
            <div className="flex space-x-4 mb-6">

              {/* --- MODIFIKASI: Tambahkan queryString ke tombol "Watch Now" --- */}
              <Link
                href={`/watch/${anime.episodes?.[0]?.slug || ''}?${queryString}`}
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

            {/* Info Grid (Tidak berubah) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-neutral-400">
              <div>
                <span className="font-semibold text-white block">Japanese</span>
                {japaneseTitle}
              </div>
              <div>
                <span className="font-semibold text-white block">Producer</span>
                {producer}
              </div>
              <div>
                <span className="font-semibold text-white block">Season</span>
                {season}
              </div>
              <div>
                <span className="font-semibold text-white block">Release Date</span>
                {releaseDate}
              </div>
              <div>
                <span className="font-semibold text-white block">Studio</span>
                {studio}
              </div>
              <div>
                <span className="font-semibold text-white block">Status</span>
                {status}
              </div>
            </div>

            {/* Genres (Tidak berubah) */}
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
      </div>

      {/* Bagian Episode List */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 py-8">
        <h2 className="text-2xl font-bold mb-4">Episodes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {anime.episodes && anime.episodes.length > 0 ? (
            anime.episodes.map((episode) => (

              // --- MODIFIKASI: Tambahkan queryString ke setiap link episode ---
              <Link
                key={episode.slug}
                href={`/watch/${episode.slug}?${queryString}`}
                className="bg-neutral-800 rounded-lg p-4 flex items-center space-x-4 hover:bg-neutral-700 transition"
              >
                <div className="w-24 h-12 bg-neutral-700 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-500 font-bold text-sm">
                    {episode.name.split(' ')[1] || 'EP'}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold line-clamp-1">
                    {episode.name}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {duration || 'N/A'}
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