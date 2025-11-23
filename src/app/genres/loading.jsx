const SkeletonGenreCard = () => (
  <div className="relative bg-neutral-800 rounded-lg overflow-hidden h-32 md:h-40 animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900"></div>
    <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
      <div className="h-5 w-20 bg-neutral-700 rounded"></div>
    </div>
  </div>
);

const SkeletonHeader = () => (
  <div className="h-8 w-56 bg-neutral-800 rounded-md animate-pulse"></div>
);

export default function Loading() {
  const skeletonCards = Array.from({ length: 20 });

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Skeleton */}
        <div className="h-12 w-full bg-neutral-800 rounded animate-pulse mb-6"></div>

        {/* Breadcrumb Skeleton */}
        <div className="h-6 w-32 bg-neutral-800 rounded animate-pulse mb-6"></div>
        
        {/* Header Skeleton */}
        <SkeletonHeader />

        {/* Count Skeleton */}
        <div className="h-5 w-40 bg-neutral-800 rounded animate-pulse mb-6 mt-4"></div>

        {/* Genre Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {skeletonCards.map((_, index) => (
            <SkeletonGenreCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
