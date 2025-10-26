import Navigation from '@/app/components/Dashboard/Navigation'
import React from 'react'
import Link from 'next/link' // Opsional: Untuk link ke episode
import { FaQuoteLeft, FaClock, FaVideo } from 'react-icons/fa'; // Icon untuk visual

// Data bohongan untuk daftar komentar
const myCommentsData = [
    {
        id: 1,
        animeTitle: 'Frieren: Beyond Journey\'s End',
        episodeInfo: 'Episode 5: "The Phantom of the Dead"',
        commentText: 'Episode ini sinematografinya keren banget, flow ceritanya juga dapet. Salah satu yang terbaik sejauh ini.',
        postedDate: '2025-10-21'

    },
    {
        id: 2,
        animeTitle: 'Jujutsu Kaisen',
        episodeInfo: 'S2, Episode 10: "Pandemonium"',
        commentText: 'Gila, pertarungan Sukuna vs Jogo epik! Animasinya gokil abis.',
        postedDate: '2025-10-24'
    },
    {
        id: 3,
        animeTitle: 'One Piece',
        episodeInfo: 'Episode 1080: "A Legendary Battle!"',
        commentText: 'Akhirnya liat Garp beraksi lagi. Keren banget kakek satu ini.',
        postedDate: '2025-10-22',
    },
];

const Page = () => {
    return (
        <section className='font-sans relative px-8 py-4 min-h-screen bg-gray-900 text-gray-100'>
            {/* Komponen navigasi Anda */}
            <Navigation />

            {/* Konten Halaman My Comments */}
            <div className='py-8 px-4 max-w-4xl mx-auto'>
                <h2 className='text-3xl font-bold mb-6 text-white'>My Comments</h2>

                {/* Kontainer untuk daftar kartu komentar */}
                <div className='flex flex-col gap-5'>

                    {/* Mapping data komentar */}
                    {myCommentsData.length > 0 && myCommentsData.map((comment) => (
                        <div
                            key={comment.id}
                            className='bg-gray-800 rounded-lg p-5 shadow-lg flex flex-col gap-3'
                        >
                            {/* 1. Info Anime/Episode */}
                            <Link
                                href="#"
                                className='group hover:text-blue-400 transition-colors duration-150'
                            >
                                <div className='flex items-center gap-2 text-sm text-gray-400 group-hover:text-blue-400'>
                                    <FaVideo />
                                    <span>Commented on <strong>{comment.animeTitle}</strong> - {comment.episodeInfo}</span>
                                </div>
                            </Link>

                            {/* 2. Isi Komentar */}
                            <div className='flex gap-3'>
                                <FaQuoteLeft className='text-gray-600 text-lg flex-shrink-0 mt-1' />
                                <p className='text-gray-200 text-base italic'>
                                    {comment.commentText}
                                </p>
                            </div>

                            {/* 3. Tanggal Posting */}
                            <div className='flex items-center gap-2 text-xs text-gray-500 mt-2 self-end'>
                                <FaClock />
                                <span>
                                    {new Date(comment.postedDate).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Pesan jika tidak ada data */}
                    {myCommentsData.length === 0 && (
                        <div className='text-center py-10 text-gray-500 bg-gray-800 rounded-lg shadow-lg'>
                            You haven't posted any comments yet.
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Page;