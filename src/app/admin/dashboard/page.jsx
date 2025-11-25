import prisma from "@/app/libs/prisma";

// Helper to format duration
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

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

export default async function AdminDashboard() {
  try {
    // Fetch all stats in parallel
    const [
      totalUsers,
      totalWatchHistory,
      totalMinutesResult,
      newUsersThisWeek,
      activeUsersToday,
      topUsers,
      recentActivity
    ] = await Promise.all([
      prisma.user.count(),
      prisma.watchHistory.count(),
      prisma.user.aggregate({ _sum: { totalWatchMinutes: true } }),
      prisma.user.count({
        where: {
          // Note: Jika User model punya createdAt field
          // createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      }),
      prisma.watchHistory.findMany({
        where: {
          watchedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        },
        distinct: ['userId'],
      }).then(results => results.length),
      prisma.user.findMany({
        take: 10,
        orderBy: { totalWatchMinutes: 'desc' },
        select: {
          email: true,
          name: true,
          level: true,
          totalWatchMinutes: true,
        }
      }),
      prisma.watchHistory.findMany({
        take: 20,
        orderBy: { watchedAt: 'desc' },
        include: {
          user: {
            select: {
              email: true,
              name: true,
              level: true
            }
          }
        }
      })
    ]);

    const totalMinutes = totalMinutesResult._sum.totalWatchMinutes || 0;
    const totalHours = Math.floor(totalMinutes / 60);

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-neutral-400">Monitor user activity and platform statistics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold mt-2">{totalUsers}</p>
              </div>
              <span className="text-4xl">👥</span>
            </div>
          </div>

          <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Watch Records</p>
                <p className="text-3xl font-bold mt-2">{totalWatchHistory}</p>
              </div>
              <span className="text-4xl">🎬</span>
            </div>
          </div>

          <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Total Watch Time</p>
                <p className="text-3xl font-bold mt-2">{totalHours}h</p>
                <p className="text-xs text-neutral-500 mt-1">{totalMinutes.toLocaleString()} minutes</p>
              </div>
              <span className="text-4xl">⏱️</span>
            </div>
          </div>

          <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Active Today</p>
                <p className="text-3xl font-bold mt-2">{activeUsersToday}</p>
              </div>
              <span className="text-4xl">🔥</span>
            </div>
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
          <h2 className="text-xl font-bold mb-4">🏆 Top Users by Watch Time</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">#</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Level</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Watch Time</th>
                </tr>
              </thead>
              <tbody>
                {topUsers.map((user, index) => (
                  <tr key={user.email} className="border-b border-neutral-700/50">
                    <td className="py-3 px-4 text-sm">{index + 1}</td>
                    <td className="py-3 px-4 text-sm font-medium">{user.email}</td>
                    <td className="py-3 px-4 text-sm">{user.name || '-'}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="bg-pink-600 px-2 py-1 rounded text-xs">
                        Level {user.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-pink-500 font-medium">
                      {formatDuration(user.totalWatchMinutes)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
          <h2 className="text-xl font-bold mb-4">📜 Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-start gap-4 p-3 bg-neutral-900 rounded-lg hover:bg-neutral-700/50 transition"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-neutral-700 rounded-lg overflow-hidden">
                  {activity.image && (
                    <img 
                      src={activity.image} 
                      alt={activity.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-pink-500">
                      {activity.user?.email || 'Unknown user'}
                    </span>
                    <span className="text-xs text-neutral-500">
                      Level {activity.user?.level || 1}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-300 truncate">
                    {activity.title || activity.episodeId}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-neutral-500">
                      {formatRelativeTime(activity.watchedAt)}
                    </span>
                    {activity.watchDuration > 0 && (
                      <span className="text-xs text-neutral-500">
                        • {activity.watchDuration} min
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading dashboard data</p>
        <p className="text-neutral-400 text-sm mt-2">{error.message}</p>
      </div>
    );
  }
}
