import React from 'react'
import AnimeSkeleton from './AnimeSkeleton'

const HomeLoading = () => {
    return (
        <div className="container mx-auto px-4 py-8 bg-[#1A1A29] min-h-screen text-white">
            {/* Hero Section Skeleton */}
            <div className="w-full max-w-5xl mx-auto mb-12 bg-[#252736] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 animate-pulse">
                {/* Left Column Skeleton */}
                <div className="p-6 md:p-12 bg-[#2E2F40]">
                    <div className="h-10 bg-neutral-700 w-1/2 mb-4 rounded"></div>
                    <div className="h-6 bg-neutral-700 w-3/4 mb-6 rounded"></div>
                    
                    {/* Search Bar Skeleton */}
                    <div className="mb-6">
                        <div className="h-10 bg-neutral-800 rounded-full"></div>
                    </div>
                    
                    {/* Top Searches Skeleton */}
                    <div className="h-4 bg-neutral-700 w-full mb-2 rounded"></div>
                    <div className="h-4 bg-neutral-700 w-3/4 mb-6 rounded"></div>
                    
                    {/* Buttons Skeleton */}
                    <div className="flex space-x-4">
                        <div className="h-10 bg-pink-800 w-1/2 rounded-full"></div>
                        <div className="h-10 bg-blue-800 w-1/2 rounded-full"></div>
                    </div>
                </div>
                
                {/* Right Column Skeleton */}
                <div className="bg-neutral-800 h-[300px] md:h-full"></div>
            </div>

            {/* Genres Section Skeleton */}
            <div className="container mx-auto px-4 mb-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="h-8 bg-neutral-700 w-1/2 mb-2 rounded"></div>
                        <div className="h-4 bg-neutral-700 w-3/4 rounded"></div>
                    </div>
                    <div className="h-6 bg-neutral-700 w-1/4 rounded"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
                        <div 
                            key={item} 
                            className="bg-[#252736] h-12 rounded-xl animate-pulse"
                        ></div>
                    ))}
                </div>
            </div>

            {/* Anime Sections Skeleton */}
            {[1, 2].map((section) => (
                <div key={section} className="container mx-auto px-4 mb-12">
                    <div className="text-center mb-8">
                        <div className="h-10 bg-neutral-700 w-1/2 mx-auto mb-2 rounded"></div>
                        <div className="h-1 bg-neutral-700 w-24 mx-auto rounded"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[1, 2, 3, 4, 5].map((anime) => (
                            <div 
                                key={anime} 
                                className="bg-[#252736] rounded-xl overflow-hidden"
                            >
                                <div className="h-64 bg-neutral-800"></div>
                                <div className="p-4">
                                    <div className="h-6 bg-neutral-700 w-3/4 rounded mb-2"></div>
                                    <div className="h-4 bg-neutral-700 w-1/2 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default HomeLoading
