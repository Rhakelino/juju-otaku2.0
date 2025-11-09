"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Kita tidak lagi butuh ikon pencarian

// Komponen Card (Tidak Berubah)
function AnimeCard({ anime }) {
    return (
        <Link href={`/detail/${anime.slug}`} className="group">
            <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-neutral-800 relative">
                <Image
                    src={anime.poster}
                    alt={anime.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => e.currentTarget.src = 'https://placehold.co/400x600/171717/ef4444?text=Error'}
                />
            </div>
            <h3 className="mt-2 text-sm font-medium text-neutral-200 truncate group-hover:text-pink-500">
                {anime.title}
            </h3>
            <p className="text-xs text-neutral-400">{anime.type || 'N/A'}</p>
        </Link>
    );
}

// Komponen Spinner (Tidak Berubah)
function Loader() {
    return (
        <div className="col-span-full flex justify-center items-center py-8">
            <div className="w-10 h-10 border-4 border-neutral-700 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
    );
}

// --- KOMPONEN BARU: Filter Huruf A-Z ---
function LetterFilter({ selectedLetter, onLetterChange }) {
    // Buat array dari 'A' sampai 'Z'
    const letters = [...Array(26)].map((_, i) => String.fromCharCode(65 + i));

    return (
        <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-2xl mx-auto">
            {letters.map((letter) => (
                <button
                    key={letter}
                    onClick={() => onLetterChange(letter)}
                    className={`
            w-10 h-10 flex items-center justify-center font-bold text-sm rounded-md transition-all
            ${selectedLetter === letter
                            ? 'bg-pink-600 text-white shadow-lg'
                            : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                        }
          `}
                >
                    {letter}
                </button>
            ))}
        </div>
    );
}
// ----------------------------------------

// Fungsi fetch ini akan berjalan di KLIEN
// (Logika ini sudah benar, tidak perlu diubah)
async function fetchAnimePage(page, letter) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const params = new URLSearchParams({
            letter: letter,
            page: page.toString(),
        });

        const response = await fetch(`${apiUrl}/animelist?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`Gagal mengambil data: ${response.status}`);
        }

        const result = await response.json();
        return result.animes || [];

    } catch (error) {
        console.error("Gagal mengambil data anime:", error);
        return [];
    }
}


export default function AnimeListClient({ initialData, initialLetter }) {
    const [animes, setAnimes] = useState(initialData || []);
    const [page, setPage] = useState(2); // Halaman BERIKUTNYA yang akan diambil
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);

    // --- STATE BARU ---
    // Melacak huruf mana yang sedang aktif
    const [selectedLetter, setSelectedLetter] = useState(initialLetter);
    // ------------------

    // --- FUNGSI BARU: Menangani klik huruf ---
    const handleLetterChange = useCallback(async (letter) => {
        // 1. Jangan lakukan apa-apa jika huruf yang diklik sama atau sedang loading
        if (letter === selectedLetter || isLoading) return;

        // 2. Set status loading & reset list
        setSelectedLetter(letter);
        setIsLoading(true);
        setAnimes([]); // Kosongkan daftar
        setPage(1); // Reset halaman ke 1
        setHasMore(true); // Asumsikan ada data baru

        // 3. Ambil halaman PERTAMA untuk huruf yang baru
        const newAnimes = await fetchAnimePage(1, letter);

        // 4. Set data baru
        setAnimes(newAnimes);
        setPage(2); // Siapkan untuk scroll halaman 2
        if (newAnimes.length === 0) {
            setHasMore(false); // Ternyata tidak ada data
        }

        setIsLoading(false);
    }, [selectedLetter, isLoading]); // Dependensi
    // ----------------------------------------

    // --- FUNGSI UPDATE: Infinite Scroll ---
    const loadMoreAnimes = useCallback(async () => {
        // Jangan fetch jika sedang loading atau sudah tidak ada data lagi
        if (isLoading || !hasMore) return;

        setIsLoading(true);

        // Panggil fungsi fetch KLIEN untuk halaman berikutnya
        // PERHATIKAN: Ini sekarang menggunakan 'selectedLetter' dari state
        const newAnimes = await fetchAnimePage(page, selectedLetter);

        if (newAnimes.length > 0) {
            setAnimes((prevAnimes) => [...prevAnimes, ...newAnimes]);
            setPage((prevPage) => prevPage + 1);
        } else {
            setHasMore(false);
        }

        setIsLoading(false);
    }, [page, selectedLetter, isLoading, hasMore]); // 'selectedLetter' ditambahkan di sini
    // ----------------------------------------

    // useEffect untuk IntersectionObserver (Tidak Berubah)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreAnimes();
                }
            },
            { rootMargin: '200px' }
        );

        const currentLoader = loaderRef.current;
        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        };
    }, [loadMoreAnimes]); // 'loadMoreAnimes' sudah memiliki semua dependensi yang benar

    return (
        <div>
            {/* --- Menampilkan Filter Huruf A-Z --- */}
            <LetterFilter
                selectedLetter={selectedLetter}
                onLetterChange={handleLetterChange}
            />
            {/* ---------------------------------- */}

            {/* Tampilkan daftar anime */}
            {/* Tampilkan loader besar di tengah JIKA sedang loading DAN list kosong (saat ganti huruf) */}
            {isLoading && animes.length === 0 ? (
                <Loader />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-6">
                    {animes.map((anime) => (
                        <AnimeCard key={`${anime.slug}-${anime.title}`} anime={anime} />
                    ))}
                </div>
            )}

            {/* Loader Bawah (Infinite Scroll) */}
            <div ref={loaderRef} className="h-10">
                {/* Tampilkan loader ini HANYA jika sedang memuat halaman berikutnya (bukan saat ganti huruf) */}
                {isLoading && animes.length > 0 && hasMore && <Loader />}
            </div>

            {/* Pesan jika data sudah habis */}
            {!hasMore && !isLoading && (
                <div className="col-span-full text-center py-8 text-neutral-500">
                    Sudah mencapai akhir daftar untuk huruf '{selectedLetter}'.
                </div>
            )}
        </div>
    );
}