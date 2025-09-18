import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function SchedulePage() {
    const [schedule, setSchedule] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://api.sankavollerei.com/anime/schedule');
                setSchedule(response.data?.data || {});
                setError(null);
            } catch (err) {
                setError('Gagal memuat jadwal anime');
                console.error('Error fetching schedule:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    const days = [
        'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'
    ];

    const AnimeCard = ({ anime }) => (
        <Link
            to={`/anime/${anime.slug}`}
            className="block bg-neutral-800 rounded-lg p-4 hover:bg-neutral-700 transition-colors border border-neutral-700"
        >
            <div className="flex items-center space-x-4">
                <div className="w-16 h-20 bg-neutral-700 rounded flex items-center justify-center">
                    <span className="text-neutral-500 text-xs">No Image</span>
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-white/90 line-clamp-2 mb-1">
                        {anime.anime_name}
                    </h3>
                    <p className="text-sm text-neutral-400">
                        {anime.time || 'Waktu tidak tersedia'}
                    </p>
                </div>
            </div>
        </Link>
    );

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 bg-neutral-900 min-h-screen text-white">
                <div className="mb-8">
                    <Link 
                        to="/" 
                        className="text-pink-500 hover:text-pink-400 transition-colors mb-4 inline-block"
                    >
                        ← Kembali ke Home
                    </Link>
                    <h1 className="text-3xl font-bold text-white/90">Jadwal Rilis Anime</h1>
                </div>
                <div className="text-center text-neutral-400 py-8">
                    <p className="text-lg">Memuat jadwal...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 bg-neutral-900 min-h-screen text-white">
                <div className="mb-8">
                    <Link 
                        to="/" 
                        className="text-pink-500 hover:text-pink-400 transition-colors mb-4 inline-block"
                    >
                        ← Kembali ke Home
                    </Link>
                    <h1 className="text-3xl font-bold text-white/90">Jadwal Rilis Anime</h1>
                </div>
                <div className="text-center text-red-500 py-8">
                    <p className="text-lg">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-neutral-900 min-h-screen text-white">
            <div className="mb-8">
                <Link 
                    to="/" 
                    className="text-pink-500 hover:text-pink-400 transition-colors mb-4 inline-block"
                >
                    ← Kembali ke Home
                </Link>
                <h1 className="text-3xl font-bold text-white/90">Jadwal Rilis Anime</h1>
                <p className="text-neutral-400 mt-2">
                    Lihat jadwal rilis anime per hari
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {days.map((day) => {
                    // Cari data hari dari array schedule
                    const dayData = Array.isArray(schedule) 
                        ? schedule.find(dayData => dayData.day === day)
                        : null;
                    const dayAnime = dayData?.anime_list || [];
                    
                    return (
                        <div key={day} className="bg-neutral-800 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-white/90 mb-4 text-center">
                                {day}
                            </h2>
                            <div className="space-y-3">
                                {dayAnime.length === 0 ? (
                                    <p className="text-neutral-400 text-center text-sm">
                                        Tidak ada anime
                                    </p>
                                ) : (
                                    dayAnime.map((anime, animeIndex) => (
                                        <AnimeCard key={animeIndex} anime={anime} />
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SchedulePage;
