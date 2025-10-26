// app/dashboard/page.jsx
import Image from "next/image";
import { AuthUserSession } from "@/app/libs/auth-libs";
// PERBAIKAN 1: Impor 'redirect' dari 'next/navigation'
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

async function DashboardPage() {
  const session = await AuthUserSession();

  // Pengecekan ini sudah benar (mengasumsikan session = { user: {...} })
  if (!session) {
    // Anda bisa redirect ke halaman login custom Anda atau halaman default NextAuth
    redirect("/api/auth/signin");
  }

  // 3. Jika ada sesi, tampilkan datanya
  return (
    <section className="font-sans p-8 min-h-screen bg-gray-900 text-gray-100">

      <Link href={"/"} className="flex gap-2 mb-3 text-pink-400 hover:underline">
        <ArrowLeftIcon className="h-5 w-5" />
        Back To Home
      </Link>
      {/* Judul diubah ke text-white */}
      <h1 className="text-3xl font-bold text-white mb-6">
        Dashboard
      </h1>

      {/* Teks paragraf diubah ke text-gray-300, strong ke text-white */}
      <p className="text-lg text-gray-300 mb-8">
        Selamat datang, <strong className="font-semibold text-white">{session.name}</strong>!
      </p>

      {/* Card profil diubah ke bg-gray-800 */}
      <div className="max-w-md bg-gray-800 rounded-lg shadow-lg p-4">
        <div className="flex items-center gap-4">
          {session.image && (
            <Image
              src={session.image}
              alt="Foto Profil"
              width={80}
              height={80}
              className="rounded-full"
              priority
            />
          )}
          {/* Teks di dalam card diubah ke text-gray-300 dan text-white */}
          <div className="flex flex-col">
            <p className="text-sm text-gray-300">
              <strong className="font-medium text-white">Nama:</strong> {session.name}
            </p>
            <p className="text-sm text-gray-300">
              <strong className="font-medium text-white">Email:</strong> {session.email}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 my-4 md:w-1/2">
        <Link href="/users/dashboard/my-history" className="border px-3 py-2 bg-pink-600 rounded-xl hover:bg-pink-700 text-center">My History</Link>
        <Link href="/users/dashboard/my-comment" className="border px-3 py-2 bg-pink-600 rounded-xl hover:bg-pink-700 text-center">My Comment</Link>
      </div>
    </section>
  );
}

export default DashboardPage;