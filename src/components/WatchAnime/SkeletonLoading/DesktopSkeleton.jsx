import React from 'react';

const WatchAnimeDesktopSkeleton = () => (
  <div className="min-h-screen bg-neutral-900 text-white p-4">
    <div className="flex space-x-4">
      <div className="w-3/4">
        <div className="bg-neutral-800 animate-pulse h-[500px] rounded-lg mb-4"></div>
      </div>
      <div className="w-1/4">
        <div className="bg-neutral-800 rounded-lg p-4">
          <div className="h-6 w-1/2 bg-neutral-700 rounded mb-4"></div>
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-10 bg-neutral-700 rounded mb-2"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default WatchAnimeDesktopSkeleton;