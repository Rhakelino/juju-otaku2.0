const SkeletonAnimeItem = () => (
  <div className="flex items-center gap-4 p-4 bg-neutral-800 rounded-lg animate-pulse">
    {/* Poster Skeleton */}
    <div className="w-16 h-24 bg-neutral-700 rounded flex-shrink-0"></div>
    
    {/* Info Skeleton */}
    <div className="flex-1 space-y-2">
      <div className="h-5 w-3/4 bg-neutral-700 rounded"></div>
      <div className="h-4 w-1/2 bg-neutral-700 rounded"></div>
      <div className="h-4 w-1/3 bg-neutral-700 rounded"></div>
    </div>
  </div>
);

const SkeletonLetterButtons = () => (
  <div className="flex flex-wrap justify-center gap-2 mb-8">
    {Array.from({ length: 26 }).map((_, index) => (
      <div
        key={index}
        className="w-10 h-10 bg-neutral-800 rounded animate-pulse"
      ></div>
    ))}
  </div>
);

export default function Loading() {
  const skeletonItems = Array.from({ length: 10 });

  return (
    <div className="min-h-screen text-white p-4 md:p-8">
      {/* Breadcrumb Skeleton */}
      <div className="h-6 w-32 bg-neutral-800 rounded animate-pulse mb-6"></div>

      {/* Title Skeleton */}
      <div className="h-9 w-72 bg-neutral-800 rounded mx-auto animate-pulse mb-8"></div>
      
      {/* Letter Buttons Skeleton */}
      <SkeletonLetterButtons />

      {/* Selected Letter Display Skeleton */}
      <div className="mb-6">
        <div className="h-8 w-48 bg-neutral-800 rounded animate-pulse"></div>
      </div>

      {/* Anime List Skeleton */}
      <div className="space-y-4">
        {skeletonItems.map((_, index) => (
          <SkeletonAnimeItem key={index} />
        ))}
      </div>

      {/* Load More Button Skeleton */}
      <div className="mt-8 flex justify-center">
        <div className="h-12 w-40 bg-neutral-800 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}
