import React from 'react'
import AnimeSkeleton from './AnimeSkeleton'

const HomeLoading = () => {
  return (
     <div className="container mx-auto px-4 py-8 bg-neutral-900 min-h-screen">
            <div className="mb-8">            
                <div className="mb-8 flex">
                    <div className="w-full max-w-lg flex ">
                        <div className="flex-grow h-10 bg-neutral-800 rounded-l-lg"></div>
                        <div className="w-24 bg-neutral-700  rounded-r-lg"></div>
                    </div>
                </div>
                {[1, 2].map((section) => (
                    <div key={section} className="mb-8">
                        <div className="h-8 bg-neutral-800 w-1/3 mx-auto mb-4 rounded"></div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
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
