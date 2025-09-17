import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

// Skeleton Loading Component
const WatchAnimeSkeleton = () => {
  return (
    <div className="min-h-screen bg-neutral-900 text-white animate-pulse p-4">
      <div className="container mx-auto">
        {/* Judul Skeleton */}
        <div className="h-8 bg-neutral-700 rounded w-3/4 mb-4"></div>

        {/* Video Player Skeleton */}
        <div className="relative pt-[56.25%] bg-neutral-800 rounded-lg mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-neutral-700 rounded-full"></div>
          </div>
        </div>

        {/* Navigation Skeleton */}
        <div className="flex justify-between mb-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-10 w-24 bg-neutral-700 rounded"></div>
          ))}
        </div>

        {/* Download Links Skeleton */}
        <div className="bg-neutral-800 rounded-lg p-6">
          <div className="h-6 bg-neutral-700 rounded w-1/2 mb-4"></div>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="mb-4">
              <div className="h-4 bg-neutral-700 rounded w-1/4 mb-2"></div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(2)].map((_, btnIndex) => (
                  <div
                    key={btnIndex}
                    className="h-10 bg-neutral-700 rounded"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function WatchAnime() {
  const { slug } = useParams();
  const [animeData, setAnimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await axios.get(`https://api.sankavollerei.com/anime/episode/${slug}`);
        console.log('Episode Data:', response.data);

        if (response.data?.data) {
          const data = response.data.data;
          console.log('Processed data:', data);

          if (data && typeof data === 'object') {
            setAnimeData(data);
          } else {
            throw new Error('Format data tidak valid');
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching anime details:', err);
        setError('Gagal memuat episode anime');
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [slug]);

  // Loading State
  if (loading) {
    return <WatchAnimeSkeleton />;
  }

  // Error State
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-900 text-red-500">
        {error}
      </div>
    );
  }

  // No Data State
  if (!animeData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-900 text-white">
        Episode tidak ditemukan
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Background Blur */}
      {animeData.anime?.poster && (
        <div
          className="absolute inset-0 bg-cover bg-center blur-xl opacity-30"
          style={{ backgroundImage: `url(${animeData.anime.poster})` }}
        ></div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Navigasi Kembali */}
        <div className="mb-4 flex items-center space-x-4 text-neutral-300">
          <Link
            to={`/anime/${animeData.anime?.slug}`}
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
            <Link
              onClick={(e) => {
    e.preventDefault();
    window.history.back();
  }}
              className="hover:text-pink-500 transition-colors"
            >
              {animeData.anime?.title || 'Anime'}
            </Link>
            <span>•</span>
            <span className="text-pink-500">{animeData.episode || 'Episode'}</span>
          </div>
        </div>

        {/* Judul Episode */}
        <h1 className="text-2xl font-bold mb-4 text-white">
          {animeData.episode || 'Episode tidak tersedia'}
        </h1>

        {/* Video Player */}
        {animeData.stream_url ? (
          <div className="w-full max-w-4xl mx-auto relative pt-[56.25%] bg-black rounded-lg overflow-hidden mb-6 shadow-xl">
            <iframe
              src={animeData.stream_url}
              className="absolute top-0 left-0 w-full h-full object-contain"
              allowFullScreen
              title={animeData.episode || 'Anime Episode'}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 bg-neutral-800 rounded-lg mb-6">
            <p className="text-neutral-400">Video tidak tersedia</p>
          </div>
        )}

        {/* Episode Navigation */}
        <div className="flex justify-between items-center mb-6">
          <div>
            {animeData.has_previous_episode && animeData.previous_episode && (
              <Link
                to={`/watch/${animeData.previous_episode.slug}`}
                className="bg-neutral-800 text-white px-4 py-2 rounded hover:bg-neutral-700 transition-colors flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Prev</span>
              </Link>
            )}
          </div>
          <div>
            {animeData.has_next_episode && animeData.next_episode && (
              <Link
                to={`/watch/${animeData.next_episode.slug}`}
                className="bg-neutral-800 text-white px-4 py-2 rounded hover:bg-neutral-700 transition-colors flex items-center space-x-2"
              >
                <span>Next</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Download Links */}
        {animeData.download_urls?.mp4 && Array.isArray(animeData.download_urls.mp4) && (
          <div className="bg-neutral-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Download Links</h2>
            {animeData.download_urls.mp4.map((quality, index) => {
              if (!quality.urls || !Array.isArray(quality.urls)) return null;

              return (
                <div key={index} className="mb-4">
                  <h3 className="font-semibold mb-2 text-neutral-300">{quality.resolution}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {quality.urls.map((uri, uriIndex) => (
                      <a
                        key={uriIndex}
                        href={uri.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-neutral-700 text-white hover:bg-neutral-600 text-center py-2 px-4 rounded transition-colors"
                      >
                        {uri.provider}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default WatchAnime;