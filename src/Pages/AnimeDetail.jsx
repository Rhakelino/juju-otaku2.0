import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function AnimeDetail() {
  const { slug } = useParams();
  const [animeData, setAnimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await axios.get(`https://api.sankavollerei.com/anime/anime/${slug}`);
        console.log('Anime Detail:', response.data);
        if (response.data) {
          setAnimeData(response.data);
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
        Anime tidak ditemukan
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={animeData.data?.poster}
              alt={animeData.data?.title}
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
              }}
            />
          </div>
          <div className="p-6 md:w-2/3">
            <h1 className="text-3xl font-bold mb-4">{animeData.data?.title}</h1>
            
            <div className="grid gap-4">
              {animeData.data?.episode_lists?.map((episode, index) => {
                // Extract episode slug from the URL structure
                const episodeUrl = episode.slug.split('/');
                const episodeSlug = episodeUrl[episodeUrl.length - 1];
                
                return (
                  <Link
                    key={index}
                    to={`/watch/${episodeSlug}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center transition-colors"
                  >
                    {episode.episode}
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-4">
              <p className="text-gray-600">
                <span className="font-semibold">Total Episode:</span> {animeData.data?.episode_lists?.length || 'Unknown'}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Duration:</span> {animeData.data?.duration || 'Unknown'}
              </p>
              {animeData.data?.batch && (
                <Link
                  to={animeData.data.batch}
                  className="inline-block mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Batch
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimeDetail;