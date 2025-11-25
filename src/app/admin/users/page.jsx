import prisma from "@/app/libs/prisma";

// Helper to get level badge name
function getLevelBadge(level) {
  if (level >= 13) return "Ota-King";
  if (level >= 10) return "Wibu Legend";
  if (level >= 7) return "Wibu Elite";
  if (level >= 5) return "Wibu Master";
  if (level >= 3) return "Wibu Veteran";
  if (level >= 2) return "Wibu Fomo";
  return "Wibu Pemula";
}

// Helper to format date
function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export default async function AdminUsersPage() {
  try {
    // Fetch all users with their stats
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        level: true,
        totalWatchMinutes: true,
        nextLevelMinutes: true,
        emailVerified: true,
        watchHistory: {
          select: {
            id: true,
            watchedAt: true
          },
          orderBy: {
            watchedAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        totalWatchMinutes: 'desc'
      }
    });

    // Calculate episode counts separately
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const episodeCount = await prisma.watchHistory.count({
          where: { userId: user.id }
        });
        
        return {
          ...user,
          episodeCount,
          lastActivity: user.watchHistory[0]?.watchedAt || null
        };
      })
    );

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Users Management</h1>
          <p className="text-neutral-400">Total: {users.length} registered users</p>
        </div>

        <div className="bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-900">
                <tr>
                  <th className="text-left py-4 px-4 text-sm font-medium text-neutral-400">#</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-neutral-400">User</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-neutral-400">Level & Badge</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-neutral-400">Watch Stats</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-neutral-400">Episodes</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-neutral-400">Progress</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-neutral-400">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {usersWithCounts.map((user, index) => {
                  const progressPercent = user.nextLevelMinutes > 0 
                    ? Math.min((user.totalWatchMinutes / user.nextLevelMinutes) * 100, 100)
                    : 0;

                  return (
                    <tr key={user.id} className="border-t border-neutral-700">
                      <td className="py-4 px-4 text-sm">{index + 1}</td>
                      
                      {/* User Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {user.image && (
                            <img 
                              src={user.image} 
                              alt={user.name || user.email}
                              className="w-10 h-10 rounded-full"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium">{user.name || 'No Name'}</p>
                            <p className="text-xs text-neutral-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      
                      {/* Level & Badge */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-pink-500">
                            Level {user.level}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {getLevelBadge(user.level)}
                          </span>
                        </div>
                      </td>
                      
                      {/* Watch Stats */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium">
                            {Math.floor(user.totalWatchMinutes / 60)}h {user.totalWatchMinutes % 60}m
                          </span>
                          <span className="text-xs text-neutral-500">
                            {user.totalWatchMinutes} minutes
                          </span>
                        </div>
                      </td>
                      
                      {/* Episodes */}
                      <td className="py-4 px-4">
                        <span className="text-sm">{user.episodeCount}</span>
                      </td>
                      
                      {/* Progress to Next Level */}
                      <td className="py-4 px-4">
                        <div className="w-32">
                          <div className="flex justify-between text-xs text-neutral-400 mb-1">
                            <span>{user.totalWatchMinutes}</span>
                            <span>{user.nextLevelMinutes}</span>
                          </div>
                          <div className="w-full bg-neutral-700 rounded-full h-2">
                            <div 
                              className="bg-pink-600 h-2 rounded-full transition-all"
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Last Active */}
                      <td className="py-4 px-4">
                        <span className="text-sm text-neutral-400">
                          {user.lastActivity 
                            ? formatDate(user.lastActivity)
                            : 'Never'
                          }
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Admin Users Page Error:", error);
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading users data</p>
        <p className="text-neutral-400 text-sm mt-2">{error.message}</p>
      </div>
    );
  }
}
