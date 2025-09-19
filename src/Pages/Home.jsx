import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchHomeAnime,
    fetchCompleteAnime
} from '../redux/animeSlice';
import { Link } from 'react-router-dom';
import axios from 'axios';
import HomeLoading from '../components/HomeLoading';
import SearchInput from '../components/SearchInput';

function Home() {
    const dispatch = useDispatch();
    const {
        ongoingAnime,
        completeAnime,
        loading,
        error
    } = useSelector((state) => state.anime);

    const [genres, setGenres] = useState([]);
    const [schedule, setSchedule] = useState({});
    const [loadingGenres, setLoadingGenres] = useState(true);
    const [loadingSchedule, setLoadingSchedule] = useState(true);

    // Fetch initial data
    useEffect(() => {
        dispatch(fetchHomeAnime());
        dispatch(fetchCompleteAnime());
    }, [dispatch]);

    // Fetch genres
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('https://api.sankavollerei.com/anime/genre');
                const data = response.data?.data || [];
                // Pastikan data adalah array
                setGenres(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error fetching genres:', err);
                setGenres([]);
            } finally {
                setLoadingGenres(false);
            }
        };
        fetchGenres();
    }, []);

    const ongoingAnimeRef = useRef(null);  

    const scrollToOngoingAnime = () => {  
        if (ongoingAnimeRef.current) {  
            // More precise scrolling with offset  
            const yOffset = 800; // Adjust based on your header/navigation height  
            const element = ongoingAnimeRef.current;  
            const y = element.getBoundingClientRect().top +   
                      window.pageYOffset +   
                      yOffset;  
            
            window.scrollTo({  
                top: y,  
                behavior: 'smooth'  
            });  
        }  
    };

    // Fetch schedule
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axios.get('https://api.sankavollerei.com/anime/schedule');
                setSchedule(response.data?.data || {});
            } catch (err) {
                console.error('Error fetching schedule:', err);
            } finally {
                setLoadingSchedule(false);
            }
        };
        fetchSchedule();
    }, []);

    const AnimeSection = ({ title, animeList }) => (
        <div className="mb-12">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full"></div>
            </div>

            {animeList.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[#1A1A29] rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <p className="text-neutral-400 text-lg">Tidak ada anime ditemukan</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {animeList.map((anime) => (
                        <Link
                            key={anime.slug}
                            to={`/anime/${anime.slug}`}
                            className="group"
                        >
                            <div className="bg-[#1A1A29]rounded-xl h-full shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border rounded-xl border-neutral-600/50 hover:border-pink-500/30 transform hover:-translate-y-2">
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={anime.poster}
                                        alt={anime.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    {anime.current_episode && (
                                        <div className="absolute top-3 right-3 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                            {anime.current_episode}
                                        </div>
                                    )}
                                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2">
                                            <p className="text-white text-xs font-medium">Klik untuk detail</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-[#1A1A29]">
                                    <h3 className="font-bold bg-[#1A1A29] text-lg mb-2 line-clamp-2 text-white/90 group-hover:text-white transition-colors">
                                        {anime.title}
                                    </h3>
                                    <div className="flex bg-[#1A1A29] justify-between items-center text-sm">
                                        <span className="text-neutral-400 bg-[#1A1A29] px-2 py-1 rounded-full text-xs">
                                            {anime.release_day || anime.type}
                                        </span>
                                        <span className="text-pink-400 font-medium">
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
        <div className="min-h-screen bg-[#1A1A29] text-white md:px-16">
            {/* Hero Section */}
            <div className="flex items-center justify-center pt-16 bg-[#1A1A29] p-4">
                <div className="w-full max-w-5xl bg-[#252736] md:h-[500px] rounded-2xl overflow-hidden 
    grid grid-cols-1 md:grid-cols-2 
    shadow-2xl shadow-black/40 border border-neutral-800/30">
                    {/* Kolom Kiri */}
                    <div className="p-6 md:p-12 flex flex-col justify-center relative 
        bg-gradient-to-b from-[#2E2F40] to-[#1A1A29] 
        order-2 md:order-1">
                        <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4 relative z-20">
                            JujuOtaku
                        </h1>
                        <p className="text-neutral-400 mb-4 md:mb-6 text-sm md:text-base relative z-20">
                            JujuOtaku adalah situs anime gratis tanpa iklan untuk menonton anime gratis
                        </p>

                        {/* Search Bar */}
                        <SearchInput />

                        {/* Top Searches */}
                        <div className="text-xs text-neutral-400 mb-4 md:mb-6 relative z-20 line-clamp-2 md:line-clamp-none">
                            Top search: Demon Slayer: Kimetsu no Y..., Demon Slayer: Kimetsu no Y...,
                            One Piece, Demon Slayer: Mt. Natagum..., Sakamoto Days Part 2,
                            The Fragrant Flower Blooms... Kaiji No. 8 Season 2,
                            Demon Slayer: Kimetsu no Y... Demon Slayer: The Hashira... To Be Hero X
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 relative z-20">
                            <button
                               onClick={scrollToOngoingAnime}
                                className="bg-pink-500 text-white px-6 py-2 md:py-3 rounded-full flex items-center justify-center"
                            >
                                Watch anime
                                <svg className="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                            <Link to={'https://sociabuzz.com/kaell22'} target='_blank' className="bg-blue-500 text-white px-6 py-2 md:py-3 rounded-full">
                                Donate JujuOtaku
                            </Link>
                        </div>
                    </div>

                    {/* Kolom Kanan (Anime Character) */}
                    <div className="relative h-[300px] md:h-auto order-1 md:order-2">
                        {/* Black Gradient Overlay */}
                        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#2E2F40] to-transparent z-10"></div>

                        <img
                            src="/images/rem.gif"
                            alt="Anime Character"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Genre Section */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Genre Populer</h2>
                            <p className="text-neutral-400">Jelajahi anime berdasarkan genre favorit</p>
                        </div>
                        <Link
                            to="/genres"
                            className="group text-pink-400 hover:text-pink-300 transition-colors text-sm font-medium flex items-center space-x-1"
                        >
                            <span>Lihat Semua</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                    {loadingGenres ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((skeleton) => (
                                <div key={skeleton} className="bg-gradient-to-br from-neutral-800 to-neutral-700 rounded-xl p-4 animate-pulse">
                                    <div className="h-4 bg-neutral-600 rounded w-3/4 mx-auto"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {genres.slice(0, 12).map((genre, index) => (
                                <Link
                                    key={genre.slug}
                                    to={`/genre/${genre.slug}`}
                                    className="group bg-[#1A1A28] border border-pink-400 rounded-xl p-4 hover:from-pink-600 hover:to-purple-600 transition-all duration-300 text-center transform hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/20"
                                >
                                    <span className="text-white/90 font-medium group-hover:text-white transition-colors">{genre.name}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Today's Schedule Preview */}
                {!loadingSchedule && Object.keys(schedule).length > 0 && (
                    <div className="mb-12">
                        <div className="flex bg-[#1A1A29] justify-between items-center mb-8 ">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">Jadwal Hari Ini</h2>
                                <p className="text-neutral-400">Anime yang tayang hari ini</p>
                            </div>
                            <Link
                                to="/schedule"
                                className="group bg-[#1A1A29] text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium flex items-center space-x-1"
                            >
                                <span>Lihat Jadwal Lengkap</span>
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                        <div className=" rounded-2xl p-6 backdrop-blur-sm bg-[#1A1A29] border  border-neutral-700/50">
                            {(() => {
                                const today = new Date().getDay();
                                const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                                const todayName = dayNames[today];

                                // Cari data hari ini dari array schedule
                                const todayData = Array.isArray(schedule)
                                    ? schedule.find(dayData => dayData.day === todayName)
                                    : null;
                                const todayAnime = todayData?.anime_list || [];

                                if (todayAnime.length === 0) {
                                    return (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-neutral-400 text-lg">Tidak ada anime yang tayang hari ini</p>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        ref={ongoingAnimeRef}
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {todayAnime.slice(0, 6).map((anime, index) => (
                                            <Link
                                                key={index}
                                                to={`/anime/${anime.slug}`}
                                                className="group bg-[#1A1A29] rounded-xl p-4 hover:from-pink-600/20 hover:to-purple-600/20 transition-all duration-300 flex items-center space-x-4 border border-neutral-600/50 hover:border-pink-500/30"
                                            >
                                                <div className="w-14 h-20 bg-gradient-to-br from-neutral-600 to-neutral-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                                    <span className="text-neutral-400 text-xs">No Image</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-white/90 line-clamp-2 text-sm group-hover:text-white transition-colors">
                                                        {anime.anime_name}
                                                    </h3>
                                                    <p className="text-xs text-neutral-400 mt-1">
                                                        {anime.time || 'Waktu tidak tersedia'}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                )}

                <AnimeSection
                    title="Anime Ongoing"
                    animeList={ongoingAnime}
                    className="scroll-mt-20 anchor-section"
                />

                <AnimeSection
                    title="Anime Complete"
                    animeList={completeAnime}
                />
            </div>
        </div>
    );
}

export default Home;