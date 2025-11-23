export default function Loading() {
  return (
    <section className="font-sans min-h-screen text-gray-100">
      {/* Header with Breadcrumb and Logout */}
      <div className="flex items-center justify-between py-8 px-4">
        <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse"></div>
        <div className="h-9 w-24 bg-zinc-800 rounded-lg animate-pulse"></div>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center px-4 pt-4">
        {/* Avatar Skeleton */}
        <div className="w-[100px] h-[100px] rounded-full bg-zinc-800 animate-pulse"></div>
        
        {/* Name Skeleton */}
        <div className="h-9 w-48 bg-zinc-800 rounded mt-4 animate-pulse"></div>
        
        {/* Badges Skeleton */}
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          <div className="h-7 w-32 bg-zinc-700 rounded-full animate-pulse"></div>
          <div className="h-7 w-24 bg-zinc-700 rounded-full animate-pulse"></div>
          <div className="h-7 w-48 bg-zinc-700 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="w-full max-w-md mx-auto mt-8 px-4 pt-8 border-t border-zinc-700">
        <div className="flex justify-around">
          <div className="text-center space-y-2">
            <div className="h-8 w-16 bg-zinc-800 rounded mx-auto animate-pulse"></div>
            <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse"></div>
          </div>
          <div className="text-center space-y-2">
            <div className="h-8 w-16 bg-zinc-800 rounded mx-auto animate-pulse"></div>
            <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse"></div>
          </div>
          <div className="text-center space-y-2">
            <div className="h-8 w-16 bg-zinc-800 rounded mx-auto animate-pulse"></div>
            <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="w-full max-w-md mx-auto mt-8 px-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 h-12 bg-zinc-800 rounded-lg animate-pulse"></div>
        <div className="flex-1 h-12 bg-zinc-800 rounded-lg animate-pulse"></div>
      </div>
    </section>
  );
}
