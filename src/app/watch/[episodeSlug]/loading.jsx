export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white animate-pulse">
      <div className="container mx-auto px-4 py-8">
        
        {/* Placeholder untuk Video Player */}
        <div className="aspect-video bg-slate-800 rounded-lg mb-4 shadow-lg"></div>

        {/* Placeholder untuk Pemilih Server */}
        <div className="bg-slate-900/50 p-4 rounded-lg mb-4">
            <div className="h-7 w-48 bg-slate-700 rounded mb-3"></div>
            <div className="flex flex-wrap gap-2">
              {/* Menampilkan beberapa placeholder tombol server */}
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="h-9 w-28 bg-slate-700 rounded-md"></div>
              ))}
            </div>
        </div>

        {/* Placeholder untuk Judul dan Navigasi Episode */}
        <div className="bg-slate-900/50 p-4 rounded-lg mb-8">
          <div className="h-8 w-3/4 bg-slate-700 rounded mb-2"></div>
          <div className="flex justify-between items-center">
            <div className="h-5 w-44 bg-slate-700 rounded"></div>
            <div className="flex space-x-2">
              <div className="h-10 w-10 bg-slate-700 rounded-full"></div>
              <div className="h-10 w-10 bg-slate-700 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Placeholder untuk Daftar Download */}
        <div className="bg-slate-900/50 p-4 rounded-lg">
           <div className="h-8 w-40 bg-slate-700 border-b-2 border-slate-700 pb-2 mb-4 rounded"></div>
           {/* Placeholder untuk satu grup format (misal: MP4) */}
           <div className="mb-4">
             <div className="h-7 w-16 bg-slate-700 rounded mb-2"></div>
             <div className="bg-slate-800 rounded-lg p-3 mb-3">
               <div className="h-5 w-20 bg-slate-700 rounded mb-2"></div>
               <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="h-7 w-24 bg-slate-700 rounded-md"></div>
                  ))}
               </div>
             </div>
             <div className="bg-slate-800 rounded-lg p-3 mb-3">
               <div className="h-5 w-20 bg-slate-700 rounded mb-2"></div>
               <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="h-7 w-24 bg-slate-700 rounded-md"></div>
                  ))}
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}