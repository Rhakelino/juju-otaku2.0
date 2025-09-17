import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await axios.get('https://api.sankavollerei.com/anime/home');
        console.log('Raw Response:', response.data);
        
        // Mengambil data dari response.data.data.ongoing_anime
        if (response.data?.data?.ongoing_anime) {
          setAnimeList(response.data.data.ongoing_anime);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching anime:', err);
        setError('Gagal mengambil data anime');
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Daftar Anime</h1>
      
      {animeList.length === 0 ? (
        <div className="text-center text-gray-500">
          Tidak ada anime ditemukan
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {animeList.map((anime) => (
            <div 
              key={anime.slug}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => window.location.href = `/anime/${anime.slug}`}
            >
              <div className="relative h-64">
                <img
                  src={anime.poster}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                  }}
                />
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 m-2 rounded text-sm">
                  {anime.current_episode}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {anime.title}
                </h3>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{anime.release_day}</span>
                  <span className="text-blue-500">{anime.newest_release_date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
