import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const GenresPage = () => {
    const [genres, setGenres] = useState([])
    const [loadingGenres, setLoadingGenres] = useState(true)

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

    // Fungsi untuk membuat warna gradient acak
    

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                            <Link 
                                to="/" 
                                className="text-pink-500 hover:text-pink-400 transition-colors mb-4 inline-block"
                            >
                                ← Kembali ke Home
                            </Link>
                        </div>
            <h1 className="text-3xl font-bold text-white mb-8 text-center">
                All Genres
            </h1>

            {loadingGenres ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[...Array(12)].map((_, skeleton) => (
                        <div 
                            key={skeleton} 
                            className="bg-neutral-800 rounded-xl p-4 animate-pulse"
                        >
                            <div className="h-4 bg-neutral-600 rounded w-3/4 mx-auto"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {genres.map((genre) => (
                        <Link
                            key={genre.slug}
                            to={`/genre/${genre.slug}`}
                            className={`
                              group bg-[#1A1A28] border border-pink-400 rounded-xl p-4 hover:from-pink-600 hover:to-purple-600 transition-all duration-300 text-center transform hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/20
                            `}
                        >
                            <span className="
                                text-white 
                                font-semibold 
                                text-sm 
                                md:text-base 
                                group-hover:scale-105 
                                transition-transform
                            ">
                                {genre.name}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default GenresPage