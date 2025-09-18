import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

// Import Components
import BackNavigation from '../components/common/BackNavigation';
import WatchAnimeMobileSkeleton from '../components/WatchAnime/SkeletonLoading/MobileSkeleton';
import WatchAnimeDesktopSkeleton from '../components/WatchAnime/SkeletonLoading/DesktopSkeleton';
import VideoPlayer from '../components/WatchAnime/VideoPlayer';
import ResolutionServerSelector from '../components/WatchAnime/ResolutionServerSelector';
import EpisodeList from '../components/WatchAnime/EpisodeList';
import DownloadLinks from '../components/WatchAnime/DownloadLinks';

function WatchAnime() {
  const { slug } = useParams();
  const [animeData, setAnimeData] = useState(null);
  const [episodeList, setEpisodeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedResolutionIndex, setSelectedResolutionIndex] = useState(0);
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);
  const [streamingUrl, setStreamingUrl] = useState(null);
  const [filteredQualities, setFilteredQualities] = useState([]);
  const [showEpisodeList, setShowEpisodeList] = useState(false);

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

  const handleResolutionChange = (e) => {
    const newResolutionIndex = parseInt(e.target.value);
    setStreamingUrl(null);
    setSelectedServerIndex(0);
    fetchStreamingUrl(newResolutionIndex, 0);
  };

  const handleServerChange = (e) => {
    const newServerIndex = parseInt(e.target.value);
    fetchStreamingUrl(selectedResolutionIndex, newServerIndex);
  };

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
        <BackNavigation 
          animeData={animeData} 
          episode={animeData.episode} 
        />

        <div className="relative">
          <VideoPlayer 
            streamingUrl={streamingUrl} 
            animeData={animeData} 
          />

          <ResolutionServerSelector
            filteredQualities={filteredQualities}
            selectedResolutionIndex={selectedResolutionIndex}
            selectedServerIndex={selectedServerIndex}
            handleResolutionChange={handleResolutionChange}
            handleServerChange={handleServerChange}
          />

          <h1 className="text-lg font-bold px-4">{animeData.anime?.title}</h1>
          <p className="text-neutral-400 px-4">{animeData.episode}</p>

          <EpisodeList 
            episodeList={episodeList} 
            slug={slug}
            showEpisodeList={showEpisodeList}
            setShowEpisodeList={setShowEpisodeList}
          />

          <DownloadLinks 
            downloadUrls={animeData.download_urls} 
          />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block container mx-auto px-4 py-8">
        <BackNavigation 
          animeData={animeData} 
          episode={animeData.episode} 
        />

        <div className="flex space-x-4">
          <div className="w-3/4">
            <VideoPlayer 
              streamingUrl={streamingUrl} 
              animeData={animeData} 
              isDesktop={true} 
            />

            <ResolutionServerSelector
              filteredQualities={filteredQualities}
              selectedResolutionIndex={selectedResolutionIndex}
              selectedServerIndex={selectedServerIndex}
              handleResolutionChange={handleResolutionChange}
              handleServerChange={handleServerChange}
              isDesktop={true}
            />
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

        <DownloadLinks 
          downloadUrls={animeData.download_urls} 
          isDesktop={true} 
        />
      </div>
    </div>
  );
}

export default WatchAnime;