const AnimeSkeleton = () => {
  return (
    <div className="bg-neutral-800 rounded-lg animate-pulse">
        <div className="h-64 bg-neutral-700"></div>
        <div className="p-4">
            <div className="h-4 bg-neutral-700 mb-2 w-3/4"></div>
            <div className="flex justify-between">
                <div className="h-3 bg-neutral-700 w-1/4"></div>
                <div className="h-3 bg-neutral-700 w-1/4"></div>
            </div>
        </div>
    </div>
  )
}

export default AnimeSkeleton
