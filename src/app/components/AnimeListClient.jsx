"use client";

import React, { useState, useEffect, useCallback } from 'react';

const PAGE_SIZE = 50; // Jumlah item yang dimuat per halaman (simulasi)

const AnimeListClient = ({ initialData }) => {
    // State untuk menyimpan data yang sudah ditampilkan
    const [displayedAnime, setDisplayedAnime] = useState(
        initialData.slice(0, PAGE_SIZE)
    );
    // State untuk melacak halaman saat ini (indeks awal)
    const [currentDataIndex, setCurrentDataIndex] = useState(PAGE_SIZE);
    // State untuk menandakan apakah masih ada data lagi yang bisa dimuat
    const [hasMore, setHasMore] = useState(initialData.length > PAGE_SIZE);
    // State untuk Loading Indicator
    const [isLoading, setIsLoading] = useState(false);

    // Fungsi untuk memuat data tambahan
    const loadMoreData = useCallback(() => {
        if (!hasMore || isLoading) return;

        setIsLoading(true);
        
        // Simulasi penundaan pengambilan data (misalnya 500ms)
        setTimeout(() => {
            const nextIndex = currentDataIndex + PAGE_SIZE;
            const newItems = initialData.slice(currentDataIndex, nextIndex);
            
            setDisplayedAnime(prev => [...prev, ...newItems]);
            setCurrentDataIndex(nextIndex);
            setIsLoading(false);

            // Cek apakah data sudah habis
            if (nextIndex >= initialData.length) {
                setHasMore(false);
            }
        }, 500);

    }, [hasMore, isLoading, currentDataIndex, initialData]);

    // Hook untuk mendeteksi scroll
    useEffect(() => {
        const handleScroll = () => {
            // Logika deteksi scroll mencapai bawah
            if (
                window.innerHeight + document.documentElement.scrollTop >= 
                document.documentElement.offsetHeight - 500 // 500px dari bawah
            ) {
                loadMoreData();
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Clean-up function
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMoreData]); // Dependencies loadMoreData

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2 p-4">
                {displayedAnime.map((anime, index) => (
                    <a 
                        key={anime.href + index} // Menggunakan index sebagai fallback key
                        href={anime.href} 
                        className="block p-2 rounded-md transition-colors bg-neutral-800/50 hover:bg-pink-700/50"
                    >
                        <p className="text-sm font-medium line-clamp-1">{anime.title}</p>
                    </a>
                ))}
            </div>

            {/* Loading Indicator */}
            {(isLoading && hasMore) && (
                <div className="text-center py-8 text-neutral-400">
                    <p>Memuat lebih banyak anime...</p>
                    {/* Anda bisa tambahkan spinner/loading animation di sini */}
                </div>
            )}
            
            {/* End of List Indicator */}
            {(!hasMore && initialData.length > 0) && (
                <div className="text-center py-8 text-neutral-500 border-t border-neutral-700 mt-4">
                    <p>🎉 Semua anime sudah ditampilkan.</p>
                </div>
            )}

            {(initialData.length === 0) && (
                 <div className="text-center py-8 text-red-500">
                    <p>Gagal memuat data anime atau data kosong.</p>
                </div>
            )}
        </div>
    );
}

export default AnimeListClient;