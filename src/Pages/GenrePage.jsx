import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AnimeSkeleton from '../components/AnimeSkeleton';

function GenrePage() {
    const { slug } = useParams();
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchGenreAnime = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://api.sankavollerei.com/anime/genre/${slug}?page=${currentPage}`);
                
                // Struktur data: response.data.data.anime
                const data = response.data?.data?.anime || [];
                
                // Pastikan data adalah array
                const animeData = Array.isArray(data) ? data : [];
                
                if (currentPage === 1) {
                    setAnimeList(animeData);
                } else {
                    setAnimeList(prev => [...prev, ...animeData]);
                }
                
                setHasMore(animeData.length > 0);
                setError(null);
            } catch (err) {
                setError('Gagal memuat anime genre');
                console.error('Error fetching genre anime:', err);
                // Set empty array jika error
                if (currentPage === 1) {
                    setAnimeList([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchGenreAnime();
    }, [slug, currentPage]);

    const loadMore = () => {
        setCurrentPage(prev => prev + 1);
    };

    const AnimeCard = ({ anime }) => (
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
                    {anime.episode_count && (
                        <div className="absolute top-0 right-0 bg-pink-600 text-white px-2 py-1 m-2 rounded text-sm">
                            {anime.episode_count} eps
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 text-white/90">
                        {anime.title}
                    </h3>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-400">
                            {anime.season || 'Unknown'}
                        </span>
                        <span className="text-pink-400">
                            {anime.studio || 'Unknown Studio'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );

    if (loading && currentPage === 1) {
        return (
            <div className="container mx-auto px-4 py-8 bg-[#1A1A29] min-h-screen text-white">
                <div className="mb-8">
                    <Link 
                        to="/" 
                        className="text-pink-500 hover:text-pink-400 transition-colors mb-4 inline-block"
                    >
                        ← Kembali ke Home
                    </Link>
                    <h1 className="text-3xl font-bold text-white/90 capitalize">
                        Genre: {slug?.replace('-', ' ')}
                    </h1>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((skeleton) => (
                        <AnimeSkeleton key={skeleton} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 bg-[#1A1A29] min-h-screen text-white">
                <div className="mb-8">
                    <Link 
                        to="/" 
                        className="text-pink-500 hover:text-pink-400 transition-colors mb-4 inline-block"
                    >
                        ← Kembali ke Home
                    </Link>
                    <h1 className="text-3xl font-bold text-white/90 capitalize">
                        Genre: {slug?.replace('-', ' ')}
                    </h1>
                </div>
                <div className="text-center text-red-500 py-8">
                    <p className="text-lg">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-[#1A1A29] min-h-screen text-white">
            <div className="mb-8">
                <Link 
                    to="/" 
                    className="text-pink-500 hover:text-pink-400 transition-colors mb-4 inline-block"
                >
                    ← Kembali ke Home
                </Link>
                <h1 className="text-3xl font-bold text-white/90 capitalize">
                    Genre: {slug?.replace('-', ' ')}
                </h1>
                <p className="text-neutral-400 mt-2">
                    {Array.isArray(animeList) ? animeList.length : 0} anime ditemukan
                </p>
            </div>

            {!Array.isArray(animeList) || animeList.length === 0 ? (
                <div className="text-center text-neutral-400 py-8">
                    <p className="text-lg">Tidak ada anime ditemukan untuk genre ini</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {animeList.map((anime, index) => (
                            <AnimeCard key={anime.slug || index} anime={anime} />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="text-center mt-8">
                            <button
                                onClick={loadMore}
                                disabled={loading}
                                className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'Memuat...' : 'Muat Lebih Banyak'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default GenrePage;
