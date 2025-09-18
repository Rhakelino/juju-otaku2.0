import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchHomeAnime, 
    fetchCompleteAnime
} from '../redux/animeSlice';
import { Link } from 'react-router-dom';
import HomeLoading from '../components/HomeLoading';

function Home() {
    const dispatch = useDispatch();
    const { 
        ongoingAnime, 
        completeAnime, 
        loading, 
        error 
    } = useSelector((state) => state.anime);

    // Fetch initial data
    useEffect(() => {
        dispatch(fetchHomeAnime());
        dispatch(fetchCompleteAnime());
    }, [dispatch]);

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
            <div className="md:mx-16 flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white/90">Juju Otaku</h1>
                <Link
                    to="/search"
                    className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Cari Anime</span>
                </Link>
            </div>

            <AnimeSection
                title="Anime Ongoing"
                animeList={ongoingAnime}
            />

            <AnimeSection
                title="Anime Complete"
                animeList={completeAnime}
            />
        </div>
    );
}

export default Home;