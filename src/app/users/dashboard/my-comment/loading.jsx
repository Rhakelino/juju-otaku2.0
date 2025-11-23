const SkeletonCommentCard = () => (
  <div className="bg-gray-800 rounded-lg p-5 shadow-lg flex flex-col gap-3 animate-pulse">
    {/* Anime/Episode Info Skeleton */}
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 bg-gray-700 rounded"></div>
      <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
    </div>

    {/* Comment Text Skeleton */}
    <div className="flex gap-3">
      <div className="w-4 h-4 bg-gray-700 rounded flex-shrink-0 mt-1"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-full bg-gray-700 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
      </div>
    </div>

    {/* Date Skeleton */}
    <div className="flex items-center gap-2 text-xs self-end">
      <div className="w-3 h-3 bg-gray-700 rounded"></div>
      <div className="h-3 w-24 bg-gray-700 rounded"></div>
    </div>
  </div>
);

export default function Loading() {
  const skeletonComments = Array.from({ length: 3 });

  return (
    <section className="font-sans relative px-8 py-4 min-h-screen bg-gray-900 text-gray-100">
      {/* Navigation Skeleton */}
      <div className="h-12 w-full bg-gray-800 rounded animate-pulse mb-6"></div>

      {/* Breadcrumb Skeleton */}
      <div className="flex gap-2 items-center mb-6">
        <div className="h-6 w-24 bg-gray-800 rounded animate-pulse"></div>
        <div className="h-6 w-6 bg-gray-800 rounded animate-pulse"></div>
        <div className="h-6 w-32 bg-gray-800 rounded animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="py-8 px-4 max-w-4xl mx-auto">
        {/* Title Skeleton */}
        <div className="h-9 w-48 bg-gray-800 rounded animate-pulse mb-6"></div>

        {/* Comment Cards Skeleton */}
        <div className="flex flex-col gap-5">
          {skeletonComments.map((_, index) => (
            <SkeletonCommentCard key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
