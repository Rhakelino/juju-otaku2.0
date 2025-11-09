export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white relative overflow-hidden">
      {/* Background Blur Placeholder */}
      <div className="absolute inset-0 bg-slate-800 blur-sm opacity-30 animate-pulse"></div>

      {/* Konten Utama */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:flex animate-pulse">
        {/* Poster Placeholder */}
        <div className="md:w-1/3 justify-center flex mb-6 md:mb-0 md:pr-8">
          <div className="w-full aspect-[2/3] bg-slate-700 rounded-lg shadow-xl"></div>
        </div>

        {/* Detail Informasi Placeholder */}
        <div className="md:w-2/3">
          {/* Judul */}
          <div className="h-10 bg-slate-700 rounded w-4/5 mb-4"></div>

          {/* Info Rating & Kategori */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-6 w-16 bg-slate-700 rounded"></div>
            <div className="h-6 w-10 bg-slate-700 rounded"></div>
            <div className="h-5 w-20 bg-slate-700 rounded"></div>
          </div>

          {/* Tombol Watch Now */}
          <div className="h-10 w-36 bg-slate-700 rounded-full mb-6"></div>

          {/* Sinopsis */}
          <div className="space-y-2 mb-6">
            <div className="h-4 bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-700 rounded w-5/6"></div>
          </div>

          {/* Grid Detail */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <div className="h-5 w-20 bg-slate-700 rounded mb-1"></div>
                <div className="h-4 w-24 bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>

          {/* Genres */}
          <div className="mt-4">
            <div className="h-5 w-16 bg-slate-700 rounded mb-2"></div>
            <div className="flex flex-wrap gap-2">
              <div className="h-7 w-20 bg-slate-700 rounded-full"></div>
              <div className="h-7 w-24 bg-slate-700 rounded-full"></div>
              <div className="h-7 w-16 bg-slate-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}