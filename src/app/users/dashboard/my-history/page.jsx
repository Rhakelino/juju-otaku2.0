import Navigation from '@/app/components/Dashboard/Navigation'
import React from 'react'
import Image from 'next/image' // Gunakan Next.js Image untuk optimasi
import Link from 'next/link'   // Gunakan Next.js Link untuk navigasi

// Data histori tontonan anime bohongan untuk contoh
const animeHistoryData = [
    { id: 1, title: 'Attack on Titan: The Final Season', episodeInfo: 'S4, Episode 28: The Dawn of Humanity', watchedDate: '2025-10-24', episodeSlug: '/watch/aot-s4-e28' },
    { id: 2, title: 'Jujutsu Kaisen', episodeInfo: 'S2, Episode 10: "Pandemonium"', watchedDate: '2025-10-24', episodeSlug: '/watch/jjk-s2-e10' },
    { id: 3, title: 'Spy x Family', episodeInfo: 'S1, Episode 12: "Penguin Park"', watchedDate: '2025-10-23', episodeSlug: '/watch/sxf-s1-e12' },
    { id: 4, title: 'One Piece', episodeInfo: 'Episode 1080: "A Legendary Battle!"', watchedDate: '2025-10-22', episodeSlug: '/watch/op-e1080' },
    { id: 5, title: 'Frieren: Beyond Journey\'s End', episodeInfo: 'Episode 5: "The Phantom of the Dead"', watchedDate: '2025-10-21',episodeSlug: '/watch/frieren-e5' },
];


const Page = () => {
    return (
        <section className='font-sans relative px-8 py-4 min-h-screen bg-gray-900 text-gray-100'>
            {/* Komponen navigasi Anda */}
            <Navigation />

            {/* Dibuat lebih sempit agar mudah dibaca di layar lebar */}
            <div className='py-8 px-4 max-w-4xl mx-auto'>
                <h2 className='text-3xl font-bold mb-6 text-white'>Watch History</h2>
                {/* Kontainer untuk daftar kartu histori */}
                <div className='grid grid-cols-2 lg:grid-cols-1 gap-4'>
                    {/* Mapping data histori */}
                    {animeHistoryData.length > 0 && animeHistoryData.map((item) => (
                        // Setiap item adalah Link yang bisa diklik ke halaman episode
                        <Link
                            href={"#"}
                            key={item.id}
                            className='flex gap-4 bg-gray-800 rounded-lg p-4 shadow-lg hover:bg-gray-700 transition-colors duration-150 ease-in-out'
                        >
                            {/* Info Tontonan */}
                            <div className='flex flex-col justify-center overflow-hidden'> {/* overflow-hidden untuk text-ellipsis */}
                                <h3 className='text-lg font-semibold text-white truncate' title={item.title}>
                                    {item.title}
                                </h3>
                                <p className='text-gray-300 text-sm truncate' title={item.episodeInfo}>
                                    {item.episodeInfo}
                                </p>
                                <p className='text-gray-400 text-xs mt-2'>
                                    {/* Memformat tanggal agar lebih rapi */}
                                    Watched on: {new Date(item.watchedDate).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Page;