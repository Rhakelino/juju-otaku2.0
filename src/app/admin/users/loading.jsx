export default function AdminUsersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="h-6 sm:h-8 w-40 sm:w-48 bg-neutral-700 rounded mb-2"></div>
        <div className="h-4 w-48 sm:w-64 bg-neutral-800 rounded"></div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          {/* Table Header */}
          <div className="bg-neutral-900 p-4 grid grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-4 bg-neutral-700 rounded"></div>
            ))}
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-neutral-700">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="p-4 grid grid-cols-7 gap-4 items-center">
                <div className="h-4 w-8 bg-neutral-700 rounded"></div>
                
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neutral-700 rounded-full flex-shrink-0"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-24 bg-neutral-700 rounded"></div>
                    <div className="h-3 w-32 bg-neutral-700 rounded"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-neutral-700 rounded"></div>
                  <div className="h-3 w-20 bg-neutral-700 rounded"></div>
                </div>
                
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-neutral-700 rounded"></div>
                  <div className="h-3 w-20 bg-neutral-700 rounded"></div>
                </div>
                
                <div className="h-3 w-12 bg-neutral-700 rounded"></div>
                
                <div className="h-2 w-32 bg-neutral-700 rounded"></div>
                
                <div className="h-3 w-20 bg-neutral-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden p-4 space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-neutral-900 p-4 rounded-lg space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="h-3 w-8 bg-neutral-700 rounded"></div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-16 bg-neutral-700 rounded"></div>
                  <div className="h-3 w-20 bg-neutral-700 rounded"></div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neutral-700 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 bg-neutral-700 rounded"></div>
                  <div className="h-3 w-40 bg-neutral-700 rounded"></div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-700">
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-neutral-700 rounded"></div>
                  <div className="h-4 w-16 bg-neutral-700 rounded"></div>
                  <div className="h-3 w-12 bg-neutral-700 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-neutral-700 rounded"></div>
                  <div className="h-4 w-10 bg-neutral-700 rounded"></div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 w-32 bg-neutral-700 rounded"></div>
                  <div className="h-3 w-16 bg-neutral-700 rounded"></div>
                </div>
                <div className="h-2 w-full bg-neutral-700 rounded"></div>
              </div>

              {/* Last Active */}
              <div className="pt-2 border-t border-neutral-700">
                <div className="h-3 w-40 bg-neutral-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
