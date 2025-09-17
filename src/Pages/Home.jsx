import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
    const [ongoingAnime, setOngoingAnime] = useState([]);
    const [completeAnime, setCompleteAnime] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const fetchAnime = async () => {
            try {
                const homeResponse = await axios.get('https://api.sankavollerei.com/anime/home');
                const completeResponse = await axios.get('https://api.sankavollerei.com/anime/complete-anime/1');

                // Set Ongoing Anime
                if (homeResponse.data?.data?.ongoing_anime) {
                    setOngoingAnime(homeResponse.data.data.ongoing_anime);
                }

                // Coba berbagai cara mengakses data complete anime
                const completeAnimeData =
                    completeResponse.data?.completeAnimeData ||
                    completeResponse.data?.data?.completeAnimeData ||
                    completeResponse.data?.anime ||
                    completeResponse.data?.data?.anime ||
                    [];

                // Set Complete Anime
                if (completeAnimeData.length > 0) {
                    setCompleteAnime(completeAnimeData);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching anime:', err.response ? err.response.data : err);
                setError('Gagal mengambil data anime');
                setLoading(false);
            }
        };
        fetchAnime();
    }, []);

    const handleSearch = async () => {
        if (searchQuery.trim() === '') return;

        try {
            setIsSearching(true);
            const response = await axios.get(`https://api.sankavollerei.com/anime/search/${searchQuery}`);

            // Pastikan struktur response sesuai
            const results = response.data?.data || response.data || [];

            setSearchResults(results);
            setIsSearching(false);
        } catch (err) {
            console.error('Error searching anime:', err);
            setSearchResults([]);
            setIsSearching(false);
        }
    };

    const AnimeSection = ({ title, animeList }) => (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>

            {animeList.length === 0 ? (
                <div className="text-center text-gray-500">
                    Tidak ada anime ditemukan
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {animeList.map((anime) => (
                        <Link
                            key={anime.slug}
                            to={`/anime/${anime.slug}`}
                        >
                            <div
                                key={anime.slug}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
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
                                    {anime.current_episode && (
                                        <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 m-2 rounded text-sm">
                                            {anime.current_episode}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                                        {anime.title}
                                    </h3>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">
                                            {anime.release_day || anime.type}
                                        </span>
                                        <span className="text-blue-500">
                                            {anime.newest_release_date || anime.year}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );

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
            <h1 className="text-3xl font-bold mb-8 text-center">Daftar Anime</h1>

            {/* Pencarian */}
            <div className="mb-8 flex justify-center">
                <div className="w-full max-w-lg flex">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari anime..."
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isSearching ? 'Mencari...' : 'Cari'}
                    </button>
                </div>
            </div>

            {/* Hasil Pencarian */}
            {searchResults.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-center">Hasil Pencarian</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {searchResults.map((anime) => (
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
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                                        {anime.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Anime Ongoing Section */}
            <AnimeSection
                title="Anime Ongoing"
                animeList={ongoingAnime}
            />

            {/* Complete Anime Section */}
            <AnimeSection
                title="Anime Complete"
                animeList={completeAnime}
            />
        </div>
    );
}

export default Home;