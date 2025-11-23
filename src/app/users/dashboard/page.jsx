// app/dashboard/page.jsx
import Image from "next/image";
import { AuthUserSession } from "@/app/libs/auth-libs";
import { redirect } from "next/navigation";
import Link from "next/link";
import BreadcrumbNavigation from "@/app/components/BreadcrumbNavigation";

async function DashboardPage() {
  const session = await AuthUserSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  // Ambil data user dari sesi
  const { name, email, image } = session;

  const breadcrumbs = [
    { title: 'Dashboard', href: '/users/dashboard' }
  ];

  return (
    // 1. Latar belakang diubah ke zinc-900
    <section className="font-sans min-h-screen text-gray-100">
      <div className="flex items-center justify-between py-8 px-4">
        <BreadcrumbNavigation crumbs={breadcrumbs} />
        <Link
          href="/api/auth/signout"
          className="border border-red-500 text-red-500 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-500/10 transition-colors"
        >
          Logout
        </Link>
      </div>

      {/* 3. Info Profil: Avatar, Nama, dan Badge (warna badge diubah) */}
      <div className="flex flex-col items-center px-4 pt-4">
        <Image
          src={image}
          alt="Foto Profil"
          width={100}
          height={100}
          className="rounded-full border-4 border-zinc-800" // diubah ke zinc-800
          priority
        />
        <h1 className="text-3xl font-bold text-white mt-4">
          {name}
        </h1>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          <span className="bg-zinc-700 text-neutral-300 text-sm font-medium px-4 py-1 rounded-full">
            Wibu Next Level
          </span>
          <span className="bg-zinc-700 text-neutral-300 text-sm font-medium px-4 py-1 rounded-full">
            Lvl. 9999
          </span>
          <span className="bg-zinc-700 text-neutral-300 text-sm font-medium px-4 py-1 rounded-full break-all">
            {email}
          </span>
        </div>
      </div>

      {/* 4. Statistik (Ditambah garis pemisah & warna) */}
      <div className="w-full max-w-md mx-auto mt-8 px-4 pt-8 border-t border-zinc-700">
        <div className="flex justify-around">
          <div className="text-center">
            {/* Angka diberi warna pink */}
            <p className="text-2xl font-bold text-pink-500">0</p>
            <p className="text-sm text-neutral-400">menit menonton</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-500">0</p>
            <p className="text-sm text-neutral-400">jumlah komentar</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-500">0</p>
            <p className="text-sm text-neutral-400">bulan bergabung</p>
          </div>
        </div>
      </div>

      {/* 5. Navigasi Tombol (Menggantikan Tab) */}
      <div className="w-full max-w-md mx-auto mt-8 px-4 flex flex-col sm:flex-row gap-4">
        <Link
          href="/users/dashboard/my-history"
          className="flex-1 text-center py-3 px-6 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors"
        >
          Riwayat Tontonan
        </Link>
        <Link
          href="/users/dashboard/my-comment"
          className="flex-1 text-center py-3 px-6 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors"
        >
          Riwayat Komentar
        </Link>
      </div>
    </section>
  );
}

export default DashboardPage;