import { AuthUserSession } from "@/app/libs/auth-libs";
import { checkAdmin } from "@/app/libs/adminAuth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard - KaelNime",
  description: "Admin dashboard for monitoring users and analytics",
};

export default async function AdminLayout({ children }) {
  const session = await AuthUserSession();
  
  // Check if user is authenticated and is admin
  if (!session) {
    redirect("/api/auth/signin");
  }
  
  if (!checkAdmin(session.email)) {
    redirect("/"); // Redirect to home if not admin
  }
  
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Admin Navigation */}
      <nav className="bg-neutral-800 border-b border-neutral-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔐</span>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="text-sm text-neutral-400 hover:text-white transition"
              >
                ← Back to Site
              </Link>
              <span className="text-sm text-neutral-400">{session.email}</span>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-4 mt-4">
            <Link 
              href="/admin/dashboard"
              className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-700 transition"
            >
              📊 Dashboard
            </Link>
            <Link 
              href="/admin/users"
              className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-700 transition"
            >
              👥 Users
            </Link>
            <Link 
              href="/admin/activity"
              className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-700 transition"
            >
              📜 Activity
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
