import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AnimeDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#1A1A29] text-white animate-pulse">
      {/* Navigasi Skeleton */}
      <div className="relative z-10 px-4 pt-4 text-neutral-300">
        <div className="container mx-auto flex items-center space-x-4">
          <div className="w-6 h-6 bg-[#2E2F40] rounded-full"></div>
          <div className="flex-grow h-4 bg-[#2E2F40] rounded w-1/2"></div>
        </div>
      </div>

      {/* Konten Utama Skeleton */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:flex">
        {/* Poster Skeleton */}
        <div className="md:w-1/3 justify-center flex mb-6 md:mb-0 md:pr-8">
          <div className="w-[250px] h-[350px] bg-gradient-to-br from-[#252736] to-[#2E2F40] rounded-lg"></div>
        </div>

        {/* Detail Informasi Skeleton */}
        <div className="md:w-2/3">
          <div className="h-10 bg-[#252736] rounded w-3/4 mb-4"></div>

          {/* Info Rating & Kategori Skeleton */}
          <div className="flex space-x-4 mb-4">
            <div className="w-16 h-6 bg-[#252736] rounded"></div>
            <div className="w-16 h-6 bg-[#252736] rounded"></div>
          </div>

          {/* Tombol Aksi Skeleton */}
          <div className="flex space-x-4 mb-6">
            <div className="w-32 h-10 bg-[#252736] rounded-full"></div>
            <div className="w-32 h-10 bg-[#252736] rounded-full"></div>
          </div>

          {/* Sinopsis Skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-[#252736] rounded w-full"></div>
            <div className="h-4 bg-[#252736] rounded w-3/4"></div>
            <div className="h-4 bg-[#252736] rounded w-1/2"></div>
          </div>

          {/* Informasi Tambahan Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 bg-[#252736] rounded w-2/3"></div>
                <div className="h-4 bg-[#252736] rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Episode List Skeleton */}
      <div className="relative z-10 container mx-auto px-4 md:px-16 py-8">
        <div className="h-8 bg-[#252736] rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-[#252736] rounded-lg p-4 flex items-center space-x-4"
            >
              <div className="w-16 h-10 bg-[#2E2F40] rounded flex items-center justify-center">
                <div className="w-10 h-4 bg-neutral-700 rounded"></div>
              </div>
              <div className="flex-grow">
                <div className="h-4 bg-[#2E2F40] rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-[#2E2F40] rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


function AnimeDetail() {
  const { slug } = useParams();
  const [animeData, setAnimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [firstEpisodeSlug, setFirstEpisodeSlug] = useState(null);
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(false);

  // Fungsi untuk toggle tampilan sinopsis
  const toggleSynopsis = () => {
    setIsExpanded(!isExpanded);
  };



  useEffect(() => {
    const fetchAnimeDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.sankavollerei.com/anime/anime/${slug}`);

        setAnimeData(response.data.data);


        // Ekstrak slug episode pertama
        if (response.data.data?.episode_lists && response.data.data.episode_lists.length > 0) {
          const firstEpisode = response.data.data.episode_lists[0];
          const episodeUrl = firstEpisode.slug.split('/');
          setFirstEpisodeSlug(episodeUrl[episodeUrl.length - 1]);
        }

        setLoading(false);
      } catch (err) {
        setError(err.response?.data || 'Gagal memuat detail anime');
        setLoading(false);
      }
    };

    fetchAnimeDetail();
  }, [slug]);


  const handleBatchDownload = async (batchSlug) => {
    if (!batchSlug) return;
    try {
      const response = await axios.get(`https://api.sankavollerei.com/anime/batch/${batchSlug}`);

      // Ambil semua kualitas dan server dari endpoint
      const qualities = response.data.data.downloadUrl.formats?.[0]?.qualities || [];

      // Navigasi ke halaman download dengan membawa data
      navigate('/anime-download/' + batchSlug, {
        state: {
          qualities: qualities,
          animeTitle: animeData.title // Tambahan info anime
        }
      });
    } catch (error) {
      console.error('Gagal mengunduh batch:', error);
      alert('Gagal mengunduh batch: ' + error.message);
    }
  };

  const isOngoing = (status) => {
    if (!status || typeof status !== 'string') return false;
    return /ongoing|on-going|currently airing/i.test(status);
  };

  const handleAddToWishlist = () => {
    try {
      const key = 'wishlist';
      const current = JSON.parse(localStorage.getItem(key) || '[]');
      const exists = current.some((item) => item.slug === slug);
      if (!exists) {
        current.push({ slug, title: animeData?.title, poster: animeData?.poster });
        localStorage.setItem(key, JSON.stringify(current));
      }
      alert('Ditambahkan ke wishlist');
    } catch (e) {
      console.error('Gagal menambahkan ke wishlist', e);
    }
  };

  if (loading) {
    return <AnimeDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-900 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Background Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm opacity-30"
        style={{ backgroundImage: `url(${animeData.poster})` }}
      ></div>

      {/* Navigasi */}
      <div className="relative z-10 px-4 pt-4 text-neutral-300">
        <div className="container mx-auto flex items-center space-x-4">
          <Link
            to={"/"}
            className="text-white hover:text-pink-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
          </Link>
          <div className="text-sm flex items-center space-x-2">
            <Link to="/" className="hover:text-pink-500 transition-colors">Home</Link>
            <span>•</span>
            <span className="text-pink-500">{animeData.title}</span>
          </div>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:flex">
        {/* Poster */}
        <div className="md:w-1/3 justify-center flex mb-6 md:mb-0 md:pr-8">
          <img
            src={animeData.poster}
            alt={animeData.title}
            className="w-[250px] h-[350px] object-cover rounded-lg shadow-xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/250x350?text=Anime+Poster';
            }}
          />
        </div>

        {/* Detail Informasi */}
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-4">{animeData.title}</h1>

          {/* Info Rating & Kategori */}
          <div className="flex items-center space-x-4 mb-4">
            <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">PG-13</span>
            <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">HD</span>
            <span className="text-neutral-400">TV • 24m</span>
          </div>

          {/* Tombol Aksi */}
          <div className="flex space-x-4 mb-6">
            {firstEpisodeSlug ? (
              <Link
                to={`/watch/${firstEpisodeSlug}`}
                className="bg-pink-600 text-white px-6 py-2 rounded-full flex items-center space-x-2 hover:bg-pink-700 transition"
              >
                Watch Now
              </Link>
            ) : (
              <button
                disabled
                className="bg-neutral-600 text-white px-6 py-2 rounded-full cursor-not-allowed"
              >
                No Episodes Available
              </button>
            )}
            {isOngoing(animeData.status) ? (
              <button
                onClick={handleAddToWishlist}
                className="bg-neutral-700 text-white px-6 py-2 rounded-full hover:bg-neutral-600"
              >
                Add to Wishlist
              </button>
            ) : (
              animeData.batch?.slug ? (
                <button
                  onClick={() => handleBatchDownload(animeData.batch.slug)}
                  className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700"
                >
                  Download Full
                </button>
              ) : null
            )}
          </div>

          {/* Sinopsis */}
          <div className='flex flex-col mb-4 overflow-hidden'>
            <p className={`text-neutral-300 ${isExpanded ? 'line-clamp-none' : 'line-clamp-3'}`}>
              {animeData.synopsis || 'Tidak ada sinopsis tersedia.'}

            </p>
              {animeData.synopsis && animeData.synopsis.length > 100 && (
                <span
                  className="text-pink-500 cursor-pointer"
                  onClick={toggleSynopsis}
                >
                  {isExpanded ? 'Tutup' : 'Baca Selengkapnya'}
                </span>
              )}
          </div>

          {/* Informasi Tambahan */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-neutral-400">

            <div>
              <span className="font-semibold text-white block">Japanese</span>
              {animeData.japanese_title || 'N/A'}
            </div>
            <div>
              <span className="font-semibold text-white block">Produser</span>
              {animeData.produser || 'N/A'}
            </div>
            <div>
              <span className="font-semibold text-white block">Rating</span>
              {animeData.rating || 'N/A'}
            </div>
            <div>
              <span className="font-semibold text-white block">Release Date</span>
              {animeData.release_date || 'N/A'}
            </div>
            <div>
              <span className="font-semibold text-white block">Studio</span>
              {animeData.studio || 'N/A'}
            </div>
            <div>
              <span className="font-semibold text-white block">Duration</span>
              {animeData.duration || 'N/A'}
            </div>
            <div>
              <span className="font-semibold text-white block">Status</span>
              {animeData.status || 'N/A'}
            </div>
          </div>

          {/* Genre */}
          <div className="mt-4">
            <span className="font-semibold text-white block mb-2">Genres</span>
            <div className="flex flex-wrap gap-2">
              {animeData.genres?.map((genre, index) => (
                <span
                  key={index}
                  className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Episode List Section */}
      <div className="relative z-10 container mx-auto px-4 md:px-16 py-8">
        <h2 className="text-2xl font-bold mb-4">Episodes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {animeData.episode_lists && animeData.episode_lists.length > 0 ? (
            animeData.episode_lists.map((episode, index) => {
              // Extract episode slug from the full slug
              const episodeUrl = episode.slug.split('/');
              const episodeSlug = episodeUrl[episodeUrl.length - 1];

              return (
                <Link
                  key={index}
                  to={`/watch/${episodeSlug}`}
                  className="bg-neutral-800 rounded-lg p-4 flex items-center space-x-4 hover:bg-neutral-900 transition"
                >
                  <div className="w-24 h-10 bg-neutral-700 rounded flex items-center justify-center">
                    <span className="text-pink-500 font-bold">EP {episode.episode_number}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold line-clamp-1">
                      {episode.episode || `Episode ${episode.episode_number}`}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {animeData.duration || 'Unknown duration'}
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center text-neutral-400">
              No episodes available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnimeDetail;