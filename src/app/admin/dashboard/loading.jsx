export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="h-6 sm:h-8 w-48 sm:w-64 bg-neutral-700 rounded mb-2"></div>
        <div className="h-4 w-64 sm:w-96 bg-neutral-800 rounded"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
            <div className="h-4 w-24 bg-neutral-700 rounded mb-4"></div>
            <div className="h-8 w-16 bg-neutral-700 rounded"></div>
          </div>
        ))}
      </div>

      {/* Top Users Skeleton - Desktop Table */}
      <div className="bg-neutral-800 p-4 sm:p-6 rounded-lg border border-neutral-700">
        <div className="h-5 sm:h-6 w-40 sm:w-48 bg-neutral-700 rounded mb-4"></div>
        
        {/* Desktop View */}
        <div className="hidden md:block space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-8 bg-neutral-700 rounded"></div>
              <div className="h-4 flex-1 bg-neutral-700 rounded"></div>
              <div className="h-4 w-20 bg-neutral-700 rounded"></div>
            </div>
          ))}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-neutral-900 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <div className="h-3 w-8 bg-neutral-700 rounded"></div>
                <div className="h-5 w-20 bg-neutral-700 rounded"></div>
              </div>
              <div className="h-4 w-3/4 bg-neutral-700 rounded"></div>
              <div className="h-3 w-1/2 bg-neutral-700 rounded"></div>
              <div className="h-4 w-24 bg-neutral-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Skeleton */}
      <div className="bg-neutral-800 p-4 sm:p-6 rounded-lg border border-neutral-700">
        <div className="h-5 sm:h-6 w-40 sm:w-48 bg-neutral-700 rounded mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 sm:gap-4 p-3 bg-neutral-900 rounded-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral-700 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 sm:h-4 w-24 sm:w-32 bg-neutral-700 rounded"></div>
                <div className="h-3 sm:h-4 w-full bg-neutral-700 rounded"></div>
                <div className="h-3 w-32 sm:w-48 bg-neutral-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
