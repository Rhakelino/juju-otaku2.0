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
  <div className="h-8 w-1/3 bg-neutral-800 rounded-md animate-pulse"></div>
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
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Skeleton */}
      <div className="h-6 w-32 bg-neutral-800 rounded animate-pulse mb-6"></div>

      {/* Header Skeleton */}
      <SkeletonHeader />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 my-8 gap-4 md:gap-6">
        {skeletonCards.map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>

      {/* Pagination Skeleton */}
      <SkeletonPagination />
    </div>
  );
}
