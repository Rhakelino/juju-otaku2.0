const SkeletonCard = () => (
  <div className="rounded-lg overflow-hidden animate-pulse">
    <div className="w-full aspect-[2/3] bg-neutral-800 rounded-lg"></div>
    <div className="mt-2 space-y-2">
      <div className="h-5 w-3/4 bg-neutral-800 rounded-md"></div>
      <div className="h-4 w-1/2 bg-neutral-800 rounded-md"></div>
    </div>
  </div>
);

const SkeletonTabs = () => (
  <div className="mb-8 overflow-x-auto">
    <div className="flex space-x-2 min-w-max pb-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="h-10 w-24 bg-neutral-800 rounded-lg animate-pulse"
        ></div>
      ))}
    </div>
  </div>
);

const SkeletonHeader = () => (
  <div className="h-8 w-48 bg-neutral-800 rounded-md animate-pulse mb-6"></div>
);

export default function Loading() {
  const skeletonCards = Array.from({ length: 10 });

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="h-6 w-32 bg-neutral-800 rounded animate-pulse mb-6"></div>
        
        {/* Header Skeleton */}
        <SkeletonHeader />

        {/* Tabs Skeleton */}
        <SkeletonTabs />

        {/* Day Title Skeleton */}
        <div className="mb-4">
          <div className="h-8 w-40 bg-neutral-800 rounded animate-pulse"></div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {skeletonCards.map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
