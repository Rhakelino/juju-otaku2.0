import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

function AnimeDownload() {
  const { batchSlug } = useParams();
  const location = useLocation();
  const [qualities, setQualities] = useState([]);
  const [selectedQualityIndex, setSelectedQualityIndex] = useState(0);
  const [animeTitle, setAnimeTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initFromState = async () => {
      try {
        setLoading(true);
        if (location.state?.qualities && Array.isArray(location.state.qualities)) {
          setQualities(location.state.qualities);
          setAnimeTitle(location.state.animeTitle || '');
          setLoading(false);
          return;
        }

        // Fallback: fetch langsung jika tidak ada state
        const response = await axios.get(`https://api.sankavollerei.com/anime/batch/${batchSlug}`);
        const fetchedQualities = response.data?.data?.downloadUrl?.formats?.[0]?.qualities || [];
        setQualities(fetchedQualities);
        setAnimeTitle(response.data?.data?.title || '');
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat link download');
        setLoading(false);
      }
    };

    initFromState();
  }, [location, batchSlug]);

  const handleDownload = (url) => {
    window.open(url, '_blank');
  };

  const handleQualityChange = (e) => {
    setSelectedQualityIndex(parseInt(e.target.value));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white p-8">
        <div className="container mx-auto">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-900 text-red-500 p-8 flex items-center justify-center">{error}</div>
    );
  }

  const selectedQuality = qualities[selectedQualityIndex] || { urls: [] };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Download Batch: {animeTitle}</h1>

        {/* Selector Kualitas */}
        <div className="mb-6 flex items-center space-x-4">
          <label className="text-neutral-300">Pilih Kualitas</label>
          <select
            value={selectedQualityIndex}
            onChange={handleQualityChange}
            className="bg-neutral-800 text-white px-4 py-2 rounded"
          >
            {qualities.map((q, idx) => (
              <option key={idx} value={idx}>{q.title} {q.size ? `• ${q.size}` : ''}</option>
            ))}
          </select>
        </div>

        {/* Server Buttons */}
        <div className="space-y-6">
          {selectedQuality.urls.map((urlObj, index) => (
            <div
              key={index}
              className="bg-neutral-800 rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-3">{urlObj.title}</h2>
              <button
                onClick={() => handleDownload(urlObj.url)}
                className="w-full bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition"
              >
                Download {urlObj.title}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnimeDownload;