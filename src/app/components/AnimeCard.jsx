import Image from 'next/image'
import Link from 'next/link'
import React from 'react' // Hapus useState dan useEffect
import { FaStar } from 'react-icons/fa' // Hapus FaEye jika tidak dipakai

// Ini adalah "Dumb Component"
// Ia hanya menerima props dan menampilkannya. Tidak ada 'fetch' data.
const AnimeCard = ({ title, image, slug, currentEpisode, rating, views, episodeCount }) => {

  // --- LOGIKA TAMPILAN (BUKAN FETCH) ---
  // Kita tentukan teks episode berdasarkan props yang ada
  let episodeText = null;
  if (currentEpisode) {
    // Ini dari 'ongoing_anime' (contoh: "Episode 4")
    episodeText = currentEpisode.replace('Eps:', 'Eps ');
  } else if (episodeCount) {
    // Ini dari 'complete_anime' (contoh: "12")
    episodeText = `Eps ${episodeCount}`;
  }
  // Jika tidak ada, 'episodeText' akan null dan tidak dirender.

  return (
    <Link
      href={`/anime/${slug}`} // key seharusnya ada di .map() di komponen parent
      className="group"
    >
      <div className="flex flex-col h-full">
        
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
          <Image
            src={image} // Prop 'image' sekarang WAJIB ada
            alt={title}
            fill // Gunakan fill
            sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105 bg-neutral-700"
            // Hapus 'priority'
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

          {/* Badge Rating: Hanya render jika prop 'rating' ada */}
          {rating && (
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-bold text-yellow-400 backdrop-blur-sm">
              <FaStar />
              <span>{rating}</span>
            </div>
          )}

          {/* Badge Episode: Hanya render jika 'episodeText' tadi dibuat */}
          {episodeText && (
            <div className="absolute bottom-2 left-2 z-10 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {episodeText}
            </div>
          )}
        </div>

        <div className="mt-2 px-1">
          <h3 className="font-semibold text-sm text-white line-clamp-2 group-hover:text-pink-400 transition-colors">
            {title}
          </h3>
          
          {/* 'views' kita gunakan untuk menampilkan info tambahan 
            (seperti 'release_day' atau 'last_release_date')
          */}

          {/* Tampilkan info rilis jika ini ONGOING (ada currentEpisode, tidak ada rating) */}
          {!rating && currentEpisode && views && (
             <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
              <span>Update setiap {views}</span>
            </div>
          )}

          {/* Tampilkan info selesai jika ini COMPLETED (ada rating, tidak ada currentEpisode) */}
          {rating && !currentEpisode && views && (
             <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
              <span>Selesai: {views}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default AnimeCard