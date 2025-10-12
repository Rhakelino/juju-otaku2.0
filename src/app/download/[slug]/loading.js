export default function Loading() {
  // Komponen untuk satu baris grup download (misal: MP4 360p beserta semua providernya)
  const DownloadRowSkeleton = () => (
    <div className="bg-slate-800/50 rounded-lg p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
      <div className="mb-4 md:mb-0">
        <div className="h-7 w-32 bg-slate-700 rounded mb-2"></div>
        <div className="h-5 w-24 bg-slate-700 rounded"></div>
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-10 w-28 bg-slate-700 rounded-md"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-900 text-white animate-pulse">
      <div className="container mx-auto px-4 py-8">
        {/* Placeholder untuk Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="h-10 w-3/4 md:w-1/2 bg-slate-700 rounded mx-auto mb-3"></div>
          <div className="h-6 w-1/3 md:w-1/4 bg-slate-700 rounded mx-auto"></div>
        </div>

        {/* Placeholder untuk Judul Batch */}
        <div className="mb-8">
          <div className="h-8 w-1/2 bg-slate-700 rounded"></div>
        </div>

        {/* Placeholder untuk daftar link download */}
        <div className="flex flex-col">
          <DownloadRowSkeleton />
          <DownloadRowSkeleton />
          <DownloadRowSkeleton />
        </div>
      </div>
    </div>
  );
}