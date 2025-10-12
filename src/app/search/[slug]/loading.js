// Komponen untuk satu kartu skeleton (reusable)
function SkeletonCard() {
  return (
    <div className="bg-slate-800/50 rounded-xl overflow-hidden animate-pulse">
      {/* Placeholder untuk Gambar */}
      <div className="aspect-[2/3] bg-slate-700"></div>
      <div className="p-4">
        {/* Placeholder untuk Judul */}
        <div className="h-5 bg-slate-700 rounded w-3/4 mb-2"></div>
        {/* Placeholder untuk Info Tambahan */}
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
      </div>
    </div>
  );
}

// Komponen utama untuk halaman loading
export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          {/* Placeholder untuk link "Kembali" */}
          <div className="h-6 w-40 bg-slate-800 rounded mb-4 animate-pulse"></div>
          {/* Placeholder untuk Judul Halaman */}
          <div className="h-10 w-3/5 bg-slate-800 rounded animate-pulse"></div>
        </div>

        {/* Grid untuk kartu-kartu skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Menampilkan 10 kartu skeleton sebagai placeholder */}
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

