import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { searchAnime, clearSearchResults } from '../redux/animeSlice';
import debounce from 'lodash/debounce';
import AnimeSkeleton from '../components/AnimeSkeleton';

function SearchPage() {
    const dispatch = useDispatch();
    const { searchResults, loading, error } = useSelector((state) => state.anime);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((query) => {
            if (query.trim()) {
                dispatch(searchAnime(query));
                setSearchParams({ q: query });
            } else {
                dispatch(clearSearchResults());
                setSearchParams({});
            }
        }, 300),
        [dispatch, setSearchParams]
    );

    // Search effect
    useEffect(() => {
        debouncedSearch(searchQuery);

        return () => {
            debouncedSearch.cancel();
        };
    }, [searchQuery, debouncedSearch]);

    // Handle search on mount if URL has query
    useEffect(() => {
        const urlQuery = searchParams.get('q');
        if (urlQuery && urlQuery !== searchQuery) {
            setSearchQuery(urlQuery);
        }
    }, [searchParams]); // Remove searchQuery dependency to prevent loop

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            dispatch(searchAnime(searchQuery.trim()));
            setSearchParams({ q: searchQuery.trim() });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-[#1A1A29] min-h-screen text-white">
            {/* Header */}
            <div className="mb-8">
                <Link 
                    to="/" 
                    className="text-pink-500 hover:text-pink-400 transition-colors mb-4 inline-block"
                >
                    ← Kembali ke Home
                </Link>
                <h1 className="text-3xl font-bold text-white/90">Pencarian Anime</h1>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="mb-8">
                <div className="w-full max-w-2xl flex">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Cari anime..."
                        className="flex-grow px-4 py-3 border border-neutral-700 bg-neutral-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <button
                        type="submit"
                        disabled={loading.search}
                        className="bg-pink-600 text-white px-6 py-3 rounded-r-lg hover:bg-pink-700 disabled:opacity-50 transition-colors"
                    >
                        {loading.search ? 'Mencari...' : 'Cari'}
                    </button>
                </div>
            </form>

            {/* Search Results */}
            {loading.search ? (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-white/90">Mencari...</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((skeleton) => (
                            <AnimeSkeleton key={skeleton} />
                        ))}
                    </div>
                </div>
            ) : error.search ? (
                <div className="text-center text-red-500 py-8">
                    <p className="text-lg">Gagal mencari anime</p>
                    <p className="text-sm text-neutral-400">{error.search}</p>
                </div>
            ) : searchQuery.trim() ? (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-white/90">
                        Hasil Pencarian untuk "{searchQuery}"
                    </h2>
                    {searchResults.length === 0 ? (
                        <div className="text-center text-neutral-400 py-8">
                            <p className="text-lg">Tidak ada anime ditemukan</p>
                            <p className="text-sm">Coba kata kunci yang berbeda</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-neutral-400 mb-6">
                                Ditemukan {searchResults.length} anime
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {searchResults.map((anime) => (
                                    <Link
                                        key={anime.slug}
                                        to={`/anime/${anime.slug}`}
                                    >
                                        <div className="bg-[#1A1A29] rounded-lg h-full shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-neutral-700">
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
                        </>
                    )}
                </div>
            ) : (
                <div className="text-center text-neutral-400 py-8">
                    <p className="text-lg">Masukkan kata kunci untuk mencari anime</p>
                </div>
            )}
        </div>
    );
}

export default SearchPage;
