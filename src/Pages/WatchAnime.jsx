import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

// Skeleton Mobile
const WatchAnimeMobileSkeleton = () => (
  <div className="min-h-screen bg-neutral-900 text-white p-4">
    {/* Video Placeholder */}
    <div className="bg-neutral-800 animate-pulse h-[200px] rounded-lg mb-4"></div>

    {/* Episode List Placeholder */}
    <div className="bg-neutral-800 rounded-lg">
      <div className="p-4">
        <div className="h-6 w-1/2 bg-neutral-700 rounded mb-4"></div>
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="h-10 bg-neutral-700 rounded mb-2"
          ></div>
        ))}
      </div>
    </div>
  </div>
);

// Skeleton Desktop
const WatchAnimeDesktopSkeleton = () => (
  <div className="min-h-screen bg-neutral-900 text-white p-4">
    <div className="flex space-x-4">
      {/* Video Placeholder */}
      <div className="w-3/4">
        <div className="bg-neutral-800 animate-pulse h-[500px] rounded-lg mb-4"></div>
      </div>

      {/* Episode List Placeholder */}
      <div className="w-1/4">
        <div className="bg-neutral-800 rounded-lg p-4">
          <div className="h-6 w-1/2 bg-neutral-700 rounded mb-4"></div>
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-10 bg-neutral-700 rounded mb-2"
            ></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

function WatchAnime() {
  const { slug } = useParams();
  const [animeData, setAnimeData] = useState(null);
  const [episodeList, setEpisodeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEpisodeList, setShowEpisodeList] = useState(false);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        // Reset states
        setLoading(true);
        setError(null);

        // Fetch episode data
        const response = await axios.get(`https://api.sankavollerei.com/anime/episode/${slug}`);

        // Extract and process data
        const data = response.data?.data;
        const episodesData = data?.additional_info?.episodeList || [];

        // Sort episodes
        const sortedEpisodes = episodesData
          .sort((a, b) => parseInt(a.title) - parseInt(b.title));

        // Set states
        setAnimeData(data);
        setEpisodeList(sortedEpisodes);
        setLoading(false);

      } catch (err) {
        console.error('Fetch Error:', err);
        setError('Failed to load anime episode');
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [slug]);

  // Loading State
  if (loading) return (
    <>
      <div className="lg:hidden">
        <WatchAnimeMobileSkeleton />
      </div>
      <div className="hidden lg:block">
        <WatchAnimeDesktopSkeleton />
      </div>
    </>
  );

  // Error State
  if (error) return (
    <div className="min-h-screen bg-neutral-900 text-red-500 flex justify-center items-center">
      {error}
    </div>
  );

  // No Data State
  if (!animeData) return (
    <div className="min-h-screen bg-neutral-900 text-white flex justify-center items-center">
      Episode Not Found
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Background Blur */}
      {animeData.anime?.poster && (
        <div
          className="fixed inset-0 bg-cover bg-center blur-xl opacity-30"
          style={{ backgroundImage: `url(${animeData.anime.poster})` }}
        />
      )}

      {/* Mobile View */}
      <div className="lg:hidden">
        <div className="mb-4 flex items-center space-x-4 pt-5 px-2 text-neutral-300">
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

        <div className="relative">
          {/* Video Player Mobile */}
          {animeData.stream_url ? (
            <div className="bg-black rounded-b-lg overflow-hidden">
              <iframe
                src={animeData.stream_url}
                className="w-full aspect-video"
                allowFullScreen
                title={animeData.episode}
              />
            </div>
          ) : (
            <div className="bg-neutral-800 rounded-b-lg h-[200px] flex justify-center items-center">
              Video Tidak Tersedia
            </div>
          )}

          {/* Judul Anime */}
          <div className="p-4 bg-neutral-900">
            <h1 className="text-lg font-bold">{animeData.anime?.title}</h1>
            <p className="text-neutral-400">{animeData.episode}</p>
          </div>

          {/* Toggle Episode List */}
          <div className="bg-neutral-800 rounded-lg m-4">
            <div
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => setShowEpisodeList(!showEpisodeList)}
            >
              <h2 className="text-lg font-bold">Daftar Episode</h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transform transition-transform ${showEpisodeList ? 'rotate-180' : ''
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Episode List Mobile */}
            {showEpisodeList && (
              <div className="p-4 pt-0">
                {episodeList.map((episode) => (
                  <Link
                    key={episode.episodeId}
                    to={`/watch/${episode.href.replace('/otakudesu/episode/', '')}`}
                    className={`block py-3 px-4 mb-2 rounded ${slug === episode.href.replace('/otakudesu/episode/', '')
                      ? 'bg-pink-600 text-white'
                      : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                      }`}
                  >
                    Episode {episode.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Download Links Mobile */}
          {animeData.download_urls?.mp4 && (
            <div className="bg-neutral-800 rounded-lg m-4 p-4">
              <h2 className="text-lg font-bold mb-4">Download Links</h2>
              {animeData.download_urls.mp4.map((quality, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-semibold text-neutral-300 mb-2">
                    {quality.resolution}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {quality.urls.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-neutral-700 text-white py-2 px-3 rounded text-center text-sm hover:bg-neutral-600"
                      >
                        {link.provider}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block container mx-auto px-4 py-8">

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

        <div className="flex space-x-4">
          {/* Video Player */}
          <div className="w-3/4">
            {animeData.stream_url ? (
              <div className="bg-black rounded-lg overflow-hidden shadow-xl">
                <iframe
                  src={animeData.stream_url}
                  className="w-full aspect-video"
                  allowFullScreen
                  title={animeData.episode}
                />
              </div>
            ) : (
              <div className="bg-neutral-800 rounded-lg h-[500px] flex justify-center items-center">
                Video Tidak Tersedia
              </div>
            )}

            {/* Judul Anime */}
            <div className="p-4 bg-neutral-900">
              <h1 className="text-lg font-bold">{animeData.anime?.title}</h1>
              <p className="text-neutral-300">{animeData.episode}</p>
            </div>
          </div>

          {/* Episode List */}
          <div className="w-1/4 max-h-[600px] overflow-y-auto">
            <div className="bg-neutral-800 rounded-lg p-4">
              <h2 className="text-xl font-bold mb-4">Daftar Episode</h2>
              {episodeList.map((episode) => (
                <Link
                  key={episode.episodeId}
                  to={`/watch/${episode.href.replace('/otakudesu/episode/', '')}`}
                  className={`block py-2 px-3 mb-2 rounded ${slug === episode.href.replace('/otakudesu/episode/', '')
                    ? 'bg-pink-600 text-white'
                    : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                    }`}
                >
                  Episode {episode.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Download Links Desktop */}
        {animeData.download_urls?.mp4 && (
          <div className="mt-6 bg-neutral-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Download Links</h2>
            {animeData.download_urls.mp4.map((quality, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold text-neutral-300">
                  {quality.resolution}
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {quality.urls.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-neutral-700 text-white py-2 px-4 rounded text-center hover:bg-neutral-600"
                    >
                      {link.provider}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WatchAnime;