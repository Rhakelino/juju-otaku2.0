import React from 'react'

const SearchInput = () => {
  return (
     <div className="relative mb-4 md:mb-6 z-20">
            <form>
                <input
                    type="text"
                    placeholder="Search anime..."
                    className="w-full px-4 py-2 md:py-3 rounded-full bg-[#2E2F40] text-white text-sm md:text-base"
                />
                <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-pink-500 text-white p-2 rounded-full"
                >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </form>
        </div>
  )
}

export default SearchInput