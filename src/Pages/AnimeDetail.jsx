import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';


const AnimeDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-neutral-900 text-white animate-pulse">
      {/* Navigasi Skeleton */}
      <div className="relative z-10 px-4 pt-4 text-neutral-300">
        <div className="container mx-auto flex items-center space-x-4">
          <div className="w-6 h-6 bg-neutral-700 rounded-full"></div>
          <div className="flex-grow h-4 bg-neutral-700 rounded w-1/2"></div>
        </div>
      </div>

      {/* Konten Utama Skeleton */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:flex">
        {/* Poster Skeleton */}
        <div className="md:w-1/3 justify-center flex mb-6 md:mb-0 md:pr-8">
          <div className="w-[250px] h-[350px] bg-neutral-700 rounded-lg"></div>
        </div>

        {/* Detail Informasi Skeleton */}
        <div className="md:w-2/3">
          <div className="h-10 bg-neutral-700 rounded w-3/4 mb-4"></div>

          {/* Info Rating & Kategori Skeleton */}
          <div className="flex space-x-4 mb-4">
            <div className="w-16 h-6 bg-neutral-700 rounded"></div>
            <div className="w-16 h-6 bg-neutral-700 rounded"></div>
          </div>

          {/* Tombol Aksi Skeleton */}
          <div className="flex space-x-4 mb-6">
            <div className="w-32 h-10 bg-neutral-700 rounded-full"></div>
            <div className="w-32 h-10 bg-neutral-700 rounded-full"></div>
          </div>

          {/* Sinopsis Skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-neutral-700 rounded w-full"></div>
            <div className="h-4 bg-neutral-700 rounded w-3/4"></div>
            <div className="h-4 bg-neutral-700 rounded w-1/2"></div>
          </div>

          {/* Informasi Tambahan Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 bg-neutral-700 rounded w-2/3"></div>
                <div className="h-4 bg-neutral-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Episode List Skeleton */}
      <div className="relative z-10 container mx-auto px-4 md:px-16 py-8">
        <div className="h-8 bg-neutral-700 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index} 
              className="bg-neutral-800 rounded-lg p-4 flex items-center space-x-4"
            >
              <div className="w-16 h-10 bg-neutral-700 rounded flex items-center justify-center">
                <div className="w-10 h-4 bg-neutral-600 rounded"></div>
              </div>
              <div className="flex-grow">
                <div className="h-4 bg-neutral-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-neutral-700 rounded w-1/2"></div>
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

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await axios.get(`https://api.sankavollerei.com/anime/anime/${slug}`);
        if (response.data) {
          setAnimeData(response.data);

          // Ekstrak slug episode pertama
          if (response.data.data?.episode_lists && response.data.data.episode_lists.length > 0) {
            const firstEpisode = response.data.data.episode_lists[0];
            const episodeUrl = firstEpisode.slug.split('/');
            const episodeSlug = episodeUrl[episodeUrl.length - 1];
            setFirstEpisodeSlug(episodeSlug);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching anime details:', err);
        setError('Gagal memuat detail anime');
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [slug]);

  if (loading) {
    return (
      <AnimeDetailSkeleton />
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-900 text-red-500">
        {error}
      </div>
    );
  }

  const data = animeData.data || {};

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Background Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-xl opacity-30"
        style={{ backgroundImage: `url(${data.poster})` }}
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
            <span className="text-pink-500">{data.title}</span>
          </div>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:flex">
        {/* Poster */}
        <div className="md:w-1/3 justify-center flex mb-6 md:mb-0 md:pr-8">
          <img
            src={data.poster}
            alt={data.title}
            className="w-[250px] h-[350px] object-cover rounded-lg shadow-xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/250x350?text=Anime+Poster';
            }}
          />
        </div>

        {/* Detail Informasi */}
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-4">{data.title}</h1>

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
            <button className="border border-neutral-600 text-white px-6 py-2 rounded-full hover:bg-neutral-800 transition">
              + Add to Watchlist
            </button>
          </div>

          {/* Sinopsis */}
          <p className="text-neutral-300 mb-4 line-clamp-3">
            {data.synopsis || 'Tidak ada sinopsis tersedia.'}
            <span className="text-pink-500 cursor-pointer ml-2">More</span>
          </p>

          {/* Informasi Tambahan */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-neutral-400">
            <div>
              <span className="font-semibold text-white block">Japanese</span>
              {data.japanese_title || 'N/A'}
            </div>
            <div>
              <span className="font-semibold text-white block">Synonyms</span>
              {data.synonyms || 'N/A'}
            </div>
            <div>
              <span className="font-semibold text-white block">Aired</span>
              {data.aired || 'N/A'}
            </div>
            <div>
              <span className="font-semibold text-white block">Premiered</span>
              {data.premiered || 'N/A'}
            </div>
            <div>
              <span className="font-semibold text-white block">Duration</span>
              {data.duration || 'N/A'}
            </div>
            <div>
              <span className="font-semibold text-white block">Status</span>
              {data.status || 'N/A'}
            </div>
          </div>

          {/* Genre */}
          <div className="mt-4">
            <span className="font-semibold text-white block mb-2">Genres</span>
            <div className="flex flex-wrap gap-2">
              {data.genres?.map((genre, index) => (
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
          {data.episode_lists && data.episode_lists.length > 0 ? (
            data.episode_lists.map((episode, index) => {
              // Extract episode slug from the full slug
              const episodeUrl = episode.slug.split('/');
              const episodeSlug = episodeUrl[episodeUrl.length - 1];

              return (
                <Link
                  key={index}
                  to={`/watch/${episodeSlug}`}
                  className="bg-neutral-800 rounded-lg p-4 flex items-center space-x-4 hover:bg-neutral-700 transition"
                >
                  <div className="w-24 h-10 bg-neutral-700 rounded flex items-center justify-center">
                    <span className="text-pink-500 font-bold">EP {episode.episode_number}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold line-clamp-1">
                      {episode.episode || `Episode ${episode.episode_number}`}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {data.duration || 'Unknown duration'}
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