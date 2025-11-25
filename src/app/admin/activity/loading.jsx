export default function AdminActivityLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="h-6 sm:h-8 w-40 sm:w-48 bg-neutral-700 rounded mb-2"></div>
        <div className="h-4 w-56 sm:w-64 bg-neutral-800 rounded"></div>
      </div>

      {/* Activity Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
            <div className="h-3 sm:h-4 w-16 sm:w-20 bg-neutral-700 rounded mb-2"></div>
            <div className="h-6 sm:h-8 w-12 sm:w-16 bg-neutral-700 rounded mb-2"></div>
            <div className="h-3 w-24 sm:w-32 bg-neutral-700 rounded"></div>
          </div>
        ))}
      </div>

      {/* Activity Feed Skeleton */}
      <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div className="h-5 sm:h-6 w-40 sm:w-48 bg-neutral-700 rounded"></div>
          <div className="h-3 sm:h-4 w-32 sm:w-40 bg-neutral-700 rounded"></div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-neutral-900 rounded-lg">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-neutral-700 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-neutral-700 rounded-full"></div>
                  <div className="h-3 w-32 sm:w-40 bg-neutral-700 rounded"></div>
                  <div className="h-3 w-12 sm:w-16 bg-neutral-700 rounded"></div>
                </div>
                <div className="h-3 sm:h-4 w-full max-w-xs sm:max-w-md bg-neutral-700 rounded"></div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="h-3 w-20 sm:w-24 bg-neutral-700 rounded"></div>
                  <div className="h-3 w-24 sm:w-32 bg-neutral-700 rounded hidden sm:block"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
