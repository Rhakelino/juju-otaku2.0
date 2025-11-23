export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      {/* Breadcrumb Skeleton */}
      <div className="absolute top-4 left-4 z-10">
        <div className="h-6 w-32 bg-gray-800 rounded animate-pulse"></div>
      </div>

      <div className="w-full max-w-sm p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        {/* Title Skeleton */}
        <div className="h-8 w-3/4 bg-gray-700 rounded mx-auto animate-pulse"></div>
        
        <div className="space-y-4">
          {/* Provider Button Skeletons */}
          <div className="h-12 w-full bg-gray-700 rounded-md animate-pulse"></div>
          <div className="h-12 w-full bg-gray-700 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
