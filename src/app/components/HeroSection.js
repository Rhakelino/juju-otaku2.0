import React from 'react'
import SearchInput from './SearchInput'
import Link from 'next/link'
import Image from 'next/image'

const HeroSection = () => {
  return (
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
              className="bg-pink-500 text-white px-6 py-2 md:py-3 rounded-full flex items-center justify-center"
            >
              Watch anime
              <svg className="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <Link href={'https://sociabuzz.com/kaell22'} target='_blank' className="bg-blue-500 text-center text-white px-6 py-2 md:py-3 rounded-full">
              Donate JujuOtaku
            </Link>
          </div>
        </div>

        {/* Kolom Kanan (Anime Character) */}
        <div className="relative h-[300px] md:h-auto order-1 md:order-2">
          {/* Black Gradient Overlay */}
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#2E2F40] to-transparent z-10"></div>
          <Image
            width={500}
            height={500}
            src="/images/rem.gif"
            alt="Anime Character"
            className="absolute inset-0 w-full h-full object-cover"
            priority={true}
          />
        </div>
      </div>
    </div>
  )
}

export default HeroSection