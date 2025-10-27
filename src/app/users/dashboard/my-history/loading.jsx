export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Riwayat Tontonan Saya</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="group animate-pulse">
            <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden" />
            <div className="h-4 bg-slate-700 rounded mt-3 w-3/4" />
            <div className="h-3 bg-slate-700 rounded mt-2 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
