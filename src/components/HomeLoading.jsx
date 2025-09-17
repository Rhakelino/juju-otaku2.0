import React from 'react'
import AnimeSkeleton from './AnimeSkeleton'

const HomeLoading = () => {
    return (
         <div className="container mx-auto px-4 py-8 bg-neutral-900 min-h-screen">
            <div className="mb-8">
                {/* Judul */}
                <div className="h-8 sm:h-10 w-1/2 sm:w-1/4 sm:ml-16 bg-neutral-700 rounded-lg mb-6 sm:mb-8"></div>

                {/* Search Input Skeleton */}
                <div className="mb-6 sm:mb-8 flex">
                    <div className="w-full sm:mx-16 max-w-lg flex">
                        <div className="flex-grow h-8 sm:h-10 bg-neutral-700 rounded-l-lg"></div>
                        <div className="w-20 sm:w-24 h-8 sm:h-10 bg-neutral-700 rounded-r-lg"></div>
                    </div>
                </div>

                {[1, 2].map((section) => (
                    <div key={section} className="mb-6 sm:mb-8 sm:mx-16">
                        <div className="h-6 sm:h-8 bg-neutral-800 w-1/2 sm:w-1/3 mx-auto mb-4 rounded"></div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                            {[1, 2, 3, 4, 5].map((skeleton) => (
                                <AnimeSkeleton key={skeleton} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HomeLoading
