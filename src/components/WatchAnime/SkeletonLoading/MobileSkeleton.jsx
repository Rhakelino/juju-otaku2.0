import React from 'react';

const WatchAnimeMobileSkeleton = () => (
  <div className="min-h-screen bg-neutral-900 text-white p-4">
    <div className="bg-neutral-800 animate-pulse h-[200px] rounded-lg mb-4"></div>
    <div className="bg-neutral-800 rounded-lg">
      <div className="p-4">
        <div className="h-6 w-1/2 bg-neutral-700 rounded mb-4"></div>
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="h-10 bg-neutral-700 rounded mb-2"></div>
        ))}
      </div>
    </div>
  </div>
);

export default WatchAnimeMobileSkeleton;