import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchHomeAnime, 
    fetchCompleteAnime, 
    searchAnime, 
    clearSearchResults 
} from '../redux/animeSlice';
import debounce from 'lodash/debounce';
import { Link } from 'react-router-dom';
import AnimeSkeleton from '../components/AnimeSkeleton';
import HomeLoading from '../components/HomeLoading';

function Home() {
    const dispatch = useDispatch();
    const { 
        ongoingAnime, 
        completeAnime, 
        searchResults, 
        loading, 
        error 
    } = useSelector((state) => state.anime);

    const [searchQuery, setSearchQuery] = useState('');

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((query) => {
            if (query.trim()) {
                dispatch(searchAnime(query));
            } else {
                dispatch(clearSearchResults());
            }
        }, 300),
        [dispatch]
    );

    // Fetch initial data
    useEffect(() => {
        dispatch(fetchHomeAnime());
        dispatch(fetchCompleteAnime());
    }, [dispatch]);

    // Search effect
    useEffect(() => {
        debouncedSearch(searchQuery);

        return () => {
            debouncedSearch.cancel();
        };
    }, [searchQuery, debouncedSearch]);

    const AnimeSection = ({ title, animeList }) => (
        <div className="mb-8 bg-neutral-900">
            <h2 className="text-2xl font-bold mb-4 text-center text-white/90">{title}</h2>

            {animeList.length === 0 ? (
                <div className="text-center text-neutral-500">
                    Tidak ada anime ditemukan
                </div>
            ) : (
                <div className="md:mx-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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

    if (loading.home) {
        return <HomeLoading />;
    }

    if (error.home) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500 bg-neutral-900">
                {error.home}
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
                        disabled={loading.search}
                        className="bg-pink-600 text-white px-4 py-2 rounded-r-lg hover:bg-pink-700 disabled:opacity-50"
                    >
                        {loading.search ? 'Mencari...' : 'Cari'}
                    </button>
                </div>
            </div>

            {/* Hasil Pencarian dengan Skeleton */}
            {loading.search ? (
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
            {!loading.search && searchResults.length === 0 && (
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