const SkeletonCard = () => (
  <div className="rounded-lg overflow-hidden animate-pulse">
    <div className="w-full aspect-[2/3] bg-neutral-800 rounded-lg"></div>
    <div className="mt-2 space-y-2">
      <div className="h-5 w-3/4 bg-neutral-800 rounded-md"></div>
      <div className="h-4 w-1/2 bg-neutral-800 rounded-md"></div>
    </div>
  </div>
);

const SkeletonHeader = () => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div className="h-8 w-48 bg-neutral-800 rounded-md animate-pulse"></div>
    <div className="h-6 w-40 bg-neutral-800 rounded animate-pulse"></div>
  </div>
);

const SkeletonPagination = () => (
  <div className="flex justify-center items-center gap-6 my-12">
    <div className="h-10 w-28 bg-neutral-800 rounded-full animate-pulse"></div>
    <div className="h-6 w-20 bg-neutral-800 rounded-md animate-pulse"></div>
    <div className="h-10 w-28 bg-neutral-800 rounded-full animate-pulse"></div>
  </div>
);

export default function Loading() {
  const skeletonCards = Array.from({ length: 10 });

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Skeleton */}
        <div className="h-12 w-full bg-neutral-800 rounded animate-pulse mb-6"></div>

        {/* Breadcrumb Skeleton */}
        <div className="flex gap-2 items-center mb-6">
          <div className="h-6 w-24 bg-neutral-800 rounded animate-pulse"></div>
          <div className="h-6 w-6 bg-neutral-800 rounded animate-pulse"></div>
          <div className="h-6 w-32 bg-neutral-800 rounded animate-pulse"></div>
        </div>
        
        {/* Header & Back Button Skeleton */}
        <SkeletonHeader />

        {/* Info Text Skeleton */}
        <div className="h-5 w-56 bg-neutral-800 rounded animate-pulse mb-6"></div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 my-8 gap-4 md:gap-6">
          {skeletonCards.map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>

        {/* Pagination Skeleton */}
        <SkeletonPagination />
      </div>
    </div>
  );
}
