const AnimeSkeleton = () => {
  return (
    <div className="bg-[#252736] rounded-xl overflow-hidden animate-pulse shadow-lg">
      <div className="h-48 sm:h-56 md:h-64 bg-gradient-to-br from-[#2E2F40] to-[#1A1A29] relative">
        <div className="absolute inset-0 bg-neutral-800/30"></div>
      </div>
      <div className="p-3 sm:p-4 bg-[#2E2F40]">
        <div className="h-3 sm:h-4 bg-neutral-700 mb-2 w-3/4 rounded"></div>
        <div className="flex justify-between items-center mt-2">
          <div className="h-2 sm:h-3 bg-neutral-700 w-1/4 rounded"></div>
          <div className="h-2 sm:h-3 bg-neutral-700 w-1/4 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export default AnimeSkeleton