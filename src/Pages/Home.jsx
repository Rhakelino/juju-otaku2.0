import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce'; // Pastikan install lodash
import AnimeSkeleton from '../components/AnimeSkeleton';
import HomeLoading from '../components/HomeLoading';


function Home() {
    const [ongoingAnime, setOngoingAnime] = useState([]);
    const [completeAnime, setCompleteAnime] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Fungsi transformasi data untuk konsistensi
    const transformAnimeData = (animeData) => ({
        slug: animeData.slug,
        title: animeData.title,
        poster: animeData.poster,
        current_episode: animeData.episode || null,
        release_day: animeData.genres?.[0]?.name || 'Unknown',
        newest_release_date: animeData.year || null,
        type: animeData.genres?.[0]?.name || 'Unknown'
    });

    // Fungsi pencarian dengan debounce
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (query.trim() === '') {
                setSearchResults([]);
                setIsSearching(false);
                return;
            }

            try {
                setIsSearching(true);
                const response = await axios.get(`https://api.sankavollerei.com/anime/search/${query}`);
                
                // Transformasi data
                const transformedResults = (response.data?.data || response.data || [])
                    .map(transformAnimeData);

                setSearchResults(transformedResults);
                setIsSearching(false);
            } catch (err) {
                console.error('Error searching anime:', err);
                setSearchResults([]);
                setIsSearching(false);
            }
        }, 300),
        []
    );

    // Effect untuk pencarian realtime
    useEffect(() => {
        debouncedSearch(searchQuery);
        
        // Pembersihan debounce
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchQuery, debouncedSearch]);

    useEffect(() => {
        const fetchAnime = async () => {
            try {
                const homeResponse = await axios.get('https://api.sankavollerei.com/anime/home');
                const completeResponse = await axios.get('https://api.sankavollerei.com/anime/complete-anime/1');

                if (homeResponse.data?.data?.ongoing_anime) {
                    setOngoingAnime(homeResponse.data.data.ongoing_anime);
                }

                const completeAnimeData =
                    completeResponse.data?.completeAnimeData ||
                    completeResponse.data?.data?.completeAnimeData ||
                    completeResponse.data?.anime ||
                    completeResponse.data?.data?.anime ||
                    [];

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

    const AnimeSection = ({ title, animeList }) => (
        <div className="mb-8 bg-neutral-900">
            <h2 className="text-2xl font-bold mb-4 text-center text-white/90">{title}</h2>

            {animeList.length === 0 ? (
                <div className="text-center text-neutral-500">
                    Tidak ada anime ditemukan
                </div>
            ) : (
                <div className="md:mx-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-6">
                    {animeList.map((anime) => (
                        <Link
                            key={anime.slug}
                            to={`/anime/${anime.slug}`}
                        >
                            <div
                                className="bg-neutral-800 rounded-lg h-full shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-neutral-700"
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
                                        <div className="absolute top-0 right-0 bg-pink-600 text-white px-2 py-1 m-2 rounded text-sm">
                                            {anime.current_episode}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2 line-clamp-2 text-white/90">
                                        {anime.title}
                                    </h3>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-neutral-400">
                                            {anime.release_day || anime.type}
                                        </span>
                                        <span className="text-pink-400">
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
        return <HomeLoading />; // Tampilkan loading state
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500 bg-neutral-900">
                {error}
            </div>
        );
    }

    return (
    <div className="container mx-auto px-4 py-8 bg-neutral-900 min-h-screen text-white">
        <h1 className="text-3xl md:mx-16 text-left font-bold mb-8 text-white/90">Juju Otaku</h1>
        
        <div className="mb-8 flex">
            <div className="w-full md:mx-16 max-w-lg flex">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari anime..."
                    className="flex-grow px-4 py-2 border border-neutral-700 bg-neutral-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                    disabled={isSearching}
                    className="bg-pink-600 text-white px-4 py-2 rounded-r-lg hover:bg-pink-700 disabled:opacity-50"
                >
                    {isSearching ? 'Mencari...' : 'Cari'}
                </button>
            </div>
        </div>

        {/* Hasil Pencarian dengan Skeleton */}
        {isSearching ? (
            <div className="mb-8 bg-neutral-900">
                <h2 className="text-2xl font-bold mb-4 text-center text-white/90">Hasil Pencarian</h2>
                <div className="md:mx-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {[1, 2, 3, 4, 5].map((skeleton) => (
                        <AnimeSkeleton key={skeleton} />
                    ))}
                </div>
            </div>
        ) : (
            searchResults.length > 0 && (
                <div className="mb-8 bg-neutral-900">
                    <h2 className="text-2xl font-bold mb-4 text-center text-white/90">Hasil Pencarian</h2>
                    <div className="md:mx-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {searchResults.map((anime) => (
                            <Link
                                key={anime.slug}
                                to={`/anime/${anime.slug}`}
                            >
                                <div
                                    className="bg-neutral-800 rounded-lg h-full shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-neutral-700"
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
                                            <div className="absolute top-0 right-0 bg-pink-600 text-white px-2 py-1 m-2 rounded text-sm">
                                                {anime.current_episode}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-white/90">
                                            {anime.title}
                                        </h3>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-neutral-400">
                                                {anime.release_day || anime.type}
                                            </span>
                                            <span className="text-pink-400">
                                                {anime.newest_release_date || anime.year}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )
        )}

        {/* Tampilkan Ongoing dan Complete hanya jika tidak sedang mencari dan tidak ada hasil pencarian */}
        {!isSearching && searchResults.length === 0 && (
            <>
                <AnimeSection
                    title="Anime Ongoing"
                    animeList={ongoingAnime}
                />

                <AnimeSection
                    title="Anime Complete"
                    animeList={completeAnime}
                />
            </>
        )}
    </div>
);
}

export default Home;