import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

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
          
          // Validasi data sebelum di-set ke state
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!animeData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Episode tidak ditemukan
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{animeData.episode || 'Episode tidak tersedia'}</h1>
      
      {/* Video Player */}
      {animeData.stream_url ? (
        <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden mb-6">
          <iframe
            src={animeData.stream_url}
            className="absolute top-0 left-0 w-full h-full"
            allowFullScreen
            title={animeData.episode || 'Anime Episode'}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      ) : (
        <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg mb-6">
          <p className="text-gray-500">Video tidak tersedia</p>
        </div>
      )}

      {/* Episode Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div>
          {animeData.has_previous_episode && animeData.previous_episode && (
            <Link
              to={`/watch/${animeData.previous_episode.slug}`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              ← Episode Sebelumnya
            </Link>
          )}
        </div>
        
        <div>
          {animeData.anime?.otakudesu_url && (
            <Link
              onTouchCancelCapture={animeData.anime.otakudesu_url}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Info Anime
            </Link>
          )}
        </div>

        <div>
          {animeData.has_next_episode && animeData.next_episode && (
            <Link
              to={`/watch/${animeData.next_episode.slug}`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Episode Selanjutnya →
            </Link>
          )}
        </div>
      </div>

      {/* Download Links */}
      {animeData.download_urls?.mp4 && Array.isArray(animeData.download_urls.mp4) && (
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Download Links</h2>
          {animeData.download_urls.mp4.map((quality, index) => {
            // Pastikan quality.urls ada dan merupakan array
            if (!quality.urls || !Array.isArray(quality.urls)) return null;
            
            return (
              <div key={index} className="mb-4">
                <h3 className="font-semibold mb-2">{quality.resolution}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {quality.urls.map((uri, uriIndex) => (
                    <Link
                      key={uriIndex}
                      to={uri.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-gray-200 text-center py-2 px-4 rounded"
                    >
                      {uri.provider}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WatchAnime;