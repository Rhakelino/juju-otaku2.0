import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

// Skeleton Mobile
const WatchAnimeMobileSkeleton = () => (
  <div className="min-h-screen bg-neutral-900 text-white p-4">
    <div className="bg-neutral-800 animate-pulse h-[200px] rounded-lg mb-4"></div>
    <div className="bg-neutral-800 rounded-lg">
      <div className="p-4">
        <div className="h-6 w-1/2 bg-neutral-700 rounded mb-4"></div>
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="h-10 bg-neutral-700 rounded mb-2"></div>
        ))}
      </div>
    </div>
  </div>
);

// Skeleton Desktop
const WatchAnimeDesktopSkeleton = () => (
  <div className="min-h-screen bg-neutral-900 text-white p-4">
    <div className="flex space-x-4">
      <div className="w-3/4">
        <div className="bg-neutral-800 animate-pulse h-[500px] rounded-lg mb-4"></div>
      </div>
      <div className="w-1/4">
        <div className="bg-neutral-800 rounded-lg p-4">
          <div className="h-6 w-1/2 bg-neutral-700 rounded mb-4"></div>
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-10 bg-neutral-700 rounded mb-2"></div>
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

  // Pilihan resolusi dan server serta URL streaming
  const [selectedResolutionIndex, setSelectedResolutionIndex] = useState(0);
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);
  const [streamingUrl, setStreamingUrl] = useState(null);

  const [showEpisodeList, setShowEpisodeList] = useState(false);

  // Array qualities tanpa 360p, untuk render option dan mapping index
  const [filteredQualities, setFilteredQualities] = useState([]);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        setStreamingUrl(null);
        setSelectedResolutionIndex(0);
        setSelectedServerIndex(0);

        const response = await axios.get(`https://api.sankavollerei.com/anime/episode/${slug}`);
        const data = response.data?.data;
        const episodesData = data?.additional_info?.episodeList || [];

        const sortedEpisodes = episodesData.sort((a, b) => parseInt(a.title) - parseInt(b.title));
        setAnimeData(data);
        setEpisodeList(sortedEpisodes);

        // Filter qualities untuk menghilangkan 360p
        if (data?.stream_servers?.qualities) {
          const filtered = data.stream_servers.qualities.filter(q => q.title !== '360p');
          setFilteredQualities(filtered);
        } else {
          setFilteredQualities([]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('Failed to load anime episode');
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [slug]);

  // Fetch streaming URL berdasarkan filteredQualities dan server index
  const fetchStreamingUrl = async (resolutionIndex, serverIndex) => {
    if (!animeData || !animeData.stream_servers) {
      alert('Data streaming tidak tersedia');
      return;
    }
    try {
      const qualities = filteredQualities;
      if (!qualities || qualities.length === 0) {
        alert('Streaming qualities tidak tersedia');
        return;
      }
      const selectedQuality = qualities[resolutionIndex];
      if (!selectedQuality) {
        alert('Resolusi tidak ditemukan');
        return;
      }
      const serverList = selectedQuality.serverList;
      if (!serverList || serverList.length === 0) {
        alert('Server streaming tidak tersedia');
        return;
      }
      const selectedServer = serverList[serverIndex];
      if (!selectedServer) {
        alert('Server tidak ditemukan');
        return;
      }

      const serverId = selectedServer.serverId;
      const res = await axios.get(`https://www.sankavollerei.com/anime/server/${serverId}`);
      const url = res.data.url;

      if (!url) {
        alert('Gagal mengambil URL streaming');
        return;
      }

      setStreamingUrl(url);
      setSelectedResolutionIndex(resolutionIndex);
      setSelectedServerIndex(serverIndex);
    } catch (error) {
      console.error('Failed to get streaming url', error);
      alert('Gagal mengambil link streaming. Silahkan coba lagi.');
    }
  };

  // Saat resolusi berubah, ambil streaming url server pertama pada resolusi itu
  const handleResolutionChange = (e) => {
    const newResolutionIndex = parseInt(e.target.value);
    setStreamingUrl(null);
    setSelectedServerIndex(0);
    fetchStreamingUrl(newResolutionIndex, 0);
  };

  // Saat server berubah
  const handleServerChange = (e) => {
    const newServerIndex = parseInt(e.target.value);
    fetchStreamingUrl(selectedResolutionIndex, newServerIndex);
  };

  // Ambil streaming url default (index 0,0) saat filteredQualities tersedia
  useEffect(() => {
    if (filteredQualities.length > 0) {
      fetchStreamingUrl(0, 0);
    }
  }, [filteredQualities]);

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

  if (error) return (
    <div className="min-h-screen bg-neutral-900 text-red-500 flex justify-center items-center">
      {error}
    </div>
  );

  if (!animeData) return (
    <div className="min-h-screen bg-neutral-900 text-white flex justify-center items-center">
      Episode Not Found
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-900 text-white relative">
      {animeData.anime?.poster && (
        <div
          className="fixed inset-0 bg-cover bg-center blur-xl opacity-30 -z-10"
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="text-sm flex items-center space-x-2">
            <Link to="/" className="hover:text-pink-500 transition-colors">Home</Link>
            <span>•</span>
            <Link
              onClick={(e) => { e.preventDefault(); window.history.back(); }}
              className="hover:text-pink-500 transition-colors"
            >
              {animeData.anime?.title || 'Anime'}
            </Link>
            <span>•</span>
            <span className="text-pink-500">{animeData.episode || 'Episode'}</span>
          </div>
        </div>

        <div className="relative">
          {(streamingUrl || animeData.stream_url) ? (
            <div className="bg-black rounded-b-lg overflow-hidden">
              <iframe
                src={streamingUrl || animeData.stream_url}
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

          {/* Pilihan Resolusi dan Server */}
          <div className="p-4 space-y-4 bg-neutral-900">
            <div>
              <label className="block mb-1 font-semibold" htmlFor="resolution-select">Pilih Resolusi:</label>
              <select
                id="resolution-select"
                className="w-full bg-neutral-800 text-white p-2 rounded"
                value={selectedResolutionIndex}
                onChange={handleResolutionChange}
              >
                {filteredQualities.map((quality, index) => (
                  <option key={quality.title} value={index}>
                    {quality.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold" htmlFor="server-select">Pilih Server:</label>
              <select
                id="server-select"
                className="w-full bg-neutral-800 text-white p-2 rounded"
                value={selectedServerIndex}
                onChange={handleServerChange}
              >
                {filteredQualities[selectedResolutionIndex]?.serverList.map((server, index) => (
                  <option key={server.serverId} value={index}>
                    {server.title}
                  </option>
                ))}
              </select>
            </div>

            <h1 className="text-lg font-bold">{animeData.anime?.title}</h1>
            <p className="text-neutral-400">{animeData.episode}</p>
          </div>

          {/* Daftar Episode */}
          <div className="bg-neutral-800 rounded-lg m-4">
            <div
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => setShowEpisodeList(!showEpisodeList)}
            >
              <h2 className="text-lg font-bold">Daftar Episode</h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transform transition-transform ${showEpisodeList ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {showEpisodeList && (
              <div className="p-4 pt-0">
                {episodeList.map((episode) => (
                  <Link
                    key={episode.episodeId}
                    to={`/watch/${episode.href.replace('/otakudesu/episode/', '')}`}
                    className={`block py-3 px-4 mb-2 rounded ${slug === episode.href.replace('/otakudesu/episode/', '') ? 'bg-pink-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'}`}
                  >
                    Episode {episode.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Download Links */}
          {animeData.download_urls?.mp4 && (
            <div className="bg-neutral-800 rounded-lg m-4 p-4">
              <h2 className="text-lg font-bold mb-4">Download Links</h2>
              {animeData.download_urls.mp4.map((quality, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-semibold text-neutral-300 mb-2">{quality.resolution}</h3>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="text-sm flex items-center space-x-2">
            <Link to="/" className="hover:text-pink-500 transition-colors">Home</Link>
            <span>•</span>
            <Link
              onClick={(e) => { e.preventDefault(); window.history.back(); }}
              className="hover:text-pink-500 transition-colors"
            >
              {animeData.anime?.title || 'Anime'}
            </Link>
            <span>•</span>
            <span className="text-pink-500">{animeData.episode || 'Episode'}</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="w-3/4">
            {(streamingUrl || animeData.stream_url) ? (
              <div className="bg-black rounded-lg overflow-hidden shadow-xl">
                <iframe
                  src={streamingUrl || animeData.stream_url}
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

            {/* Pilihan Resolusi dan Server */}
            <div className="p-4 space-y-4 bg-neutral-900 mt-4">
              <div>
                <label className="block mb-1 font-semibold" htmlFor="resolution-select-desktop">Pilih Resolusi:</label>
                <select
                  id="resolution-select-desktop"
                  className="w-full bg-neutral-800 text-white p-2 rounded"
                  value={selectedResolutionIndex}
                  onChange={handleResolutionChange}
                >
                  {filteredQualities.map((quality, index) => (
                    <option key={quality.title} value={index}>
                      {quality.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold" htmlFor="server-select-desktop">Pilih Server:</label>
                <select
                  id="server-select-desktop"
                  className="w-full bg-neutral-800 text-white p-2 rounded"
                  value={selectedServerIndex}
                  onChange={handleServerChange}
                >
                  {filteredQualities[selectedResolutionIndex]?.serverList.map((server, index) => (
                    <option key={server.serverId} value={index}>
                      {server.title}
                    </option>
                  ))}
                </select>
              </div>

              <h1 className="text-lg font-bold">{animeData.anime?.title}</h1>
              <p className="text-neutral-300">{animeData.episode}</p>
            </div>
          </div>

          <div className="w-1/4 max-h-[600px] overflow-y-auto">
            <div className="bg-neutral-800 rounded-lg p-4">
              <h2 className="text-xl font-bold mb-4">Daftar Episode</h2>
              {episodeList.map((episode) => (
                <Link
                  key={episode.episodeId}
                  to={`/watch/${episode.href.replace('/otakudesu/episode/', '')}`}
                  className={`block py-2 px-3 mb-2 rounded ${slug === episode.href.replace('/otakudesu/episode/', '') ? 'bg-pink-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'}`}
                >
                  Episode {episode.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Download Links */}
        {animeData.download_urls?.mp4 && (
          <div className="mt-6 bg-neutral-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Download Links</h2>
            {animeData.download_urls.mp4.map((quality, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold text-neutral-300">{quality.resolution}</h3>
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
