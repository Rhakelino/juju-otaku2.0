import prisma from "@/app/libs/prisma";

// Helper to format relative time
function formatRelativeTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

// Helper to format full timestamp
function formatTimestamp(date) {
  return new Date(date).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default async function AdminActivityPage() {
  try {
    // Fetch recent activity (last 100 records)
    const recentActivity = await prisma.watchHistory.findMany({
      take: 100,
      orderBy: { watchedAt: 'desc' },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            image: true,
            level: true
          }
        }
      }
    });

    // Get activity stats
    const [todayCount, yesterdayCount, thisWeekCount] = await Promise.all([
      prisma.watchHistory.count({
        where: {
          watchedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      }),
      prisma.watchHistory.count({
        where: {
          watchedAt: {
            gte: new Date(Date.now() - 48 * 60 * 60 * 1000),
            lt: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.watchHistory.count({
        where: {
          watchedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      })
    ]);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Activity Monitor</h1>
          <p className="text-sm sm:text-base text-neutral-400">Real-time watch activity tracking</p>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
            <p className="text-xs sm:text-sm text-neutral-400">Today</p>
            <p className="text-xl sm:text-2xl font-bold text-pink-500 mt-1">{todayCount}</p>
            <p className="text-xs text-neutral-500 mt-1">watch activities</p>
          </div>
          
          <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
            <p className="text-xs sm:text-sm text-neutral-400">Yesterday</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-500 mt-1">{yesterdayCount}</p>
            <p className="text-xs text-neutral-500 mt-1">watch activities</p>
          </div>
          
          <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
            <p className="text-xs sm:text-sm text-neutral-400">This Week</p>
            <p className="text-xl sm:text-2xl font-bold text-purple-500 mt-1">{thisWeekCount}</p>
            <p className="text-xs text-neutral-500 mt-1">watch activities</p>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <h2 className="text-lg sm:text-xl font-bold">📜 Recent Activity Feed</h2>
            <span className="text-xs sm:text-sm text-neutral-400">
              Showing last {recentActivity.length} activities
            </span>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-neutral-900 rounded-lg hover:bg-neutral-700/50 transition"
              >
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  {activity.image ? (
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-neutral-700 flex items-center justify-center">
                      <span className="text-xl sm:text-2xl">🎬</span>
                    </div>
                  )}
                </div>

                {/* Activity Info */}
                <div className="flex-1 min-w-0">
                  {/* User Info */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {activity.user?.image && (
                      <img
                        src={activity.user.image}
                        alt={activity.user.email}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                      />
                    )}
                    <span className="text-xs sm:text-sm font-medium text-pink-500 truncate">
                      {activity.user?.email || 'Unknown user'}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-neutral-700 rounded">
                      Level {activity.user?.level || 1}
                    </span>
                  </div>

                  {/* Anime/Episode Title */}
                  <p className="text-xs sm:text-sm font-medium text-white mb-1 line-clamp-2">
                    {activity.episodeId}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      🕐 {formatRelativeTime(activity.watchedAt)}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">{formatTimestamp(activity.watchedAt)}</span>
                    {activity.watchDuration > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-pink-500">
                          {activity.watchDuration} min
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Activity Number */}
                <div className="flex-shrink-0 text-right hidden sm:block">
                  <span className="text-xs text-neutral-500">#{index + 1}</span>
                </div>
              </div>
            ))}
          </div>

          {recentActivity.length === 0 && (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">📭</span>
              <p className="text-neutral-400">No activity yet</p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Admin Activity Page Error:", error);
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading activity data</p>
        <p className="text-neutral-400 text-sm mt-2">{error.message}</p>
      </div>
    );
  }
}
