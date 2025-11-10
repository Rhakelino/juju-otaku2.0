'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ContextMenu from './ContextMenu';

// Fungsi helper untuk format slug (Tidak berubah)
function formatEpisodeId(slug) {
  if (!slug) return "";
  const match = slug.match(/episode-(\d+)/);
  if (match && match[1]) {
    return `Episode ${match[1]}`;
  }
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function HistoryList({ initialHistory }) {
  const [items, setItems] = useState(initialHistory);
  const [menu, setMenu] = useState(null); // { x, y, item }
  
  // State untuk melacak ID item yang sedang dihapus
  const [deletingId, setDeletingId] = useState(null); 
  
  const timerRef = useRef(null);
  const wasLongPress = useRef(false);

  const closeMenu = () => setMenu(null);

  // Efek untuk menutup menu (Tidak berubah)
  useEffect(() => {
    const handleClickOutside = () => closeMenu();
    if (menu) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [menu]);

  // Handler (Desktop & Mobile) (Tidak berubah)
  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY, item });
  };
  const handleTouchStart = (e, item) => {
    wasLongPress.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      wasLongPress.current = true;
      setMenu({ x: e.touches[0].clientX, y: e.touches[0].clientY, item });
    }, 700); // 700ms
  };
  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
  const handleTouchMove = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
  const handleClick = (e) => {
    if (wasLongPress.current) {
      e.preventDefault();
      wasLongPress.current = false;
    }
  };

  // Handler untuk Hapus (Tidak berubah)
  const handleDelete = async () => {
    if (deletingId || !menu) return; 

    const itemToDelete = menu.item;
    setDeletingId(itemToDelete.id); 

    try {
      const response = await fetch(`/api/history?id=${itemToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus riwayat');
      }

      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== itemToDelete.id)
      );
      
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus riwayat.');
    } finally {
      setDeletingId(null); 
      closeMenu();
    }
  };

  return (
    <>
      {items.length === 0 ? (
        <p>Kamu belum menonton. nonton dulu ya kids</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => {
            // Cek apakah item ini yang sedang dihapus
            const isCurrentlyDeleting = item.id === deletingId;

            // --- INI ADALAH PERBAIKANNYA ---
            // 1. Ambil data yang kita butuhkan dari 'item'
            //    (Pastikan nama field ini sesuai dengan skema Prisma Anda)
            const slug = item.animeId;     // Slug bersih (cth: "one-punch-man-s3")
            const title = item.title;    // Judul anime (cth: "One Punch Man S3")
            const image = item.image;    // URL Poster
            
            // 2. Buat Query String
            const historyQueryParams = new URLSearchParams();
            if (slug) historyQueryParams.set('slug', slug);
            if (title) historyQueryParams.set('title', title);
            if (image) historyQueryParams.set('image', image);
            
            const queryString = historyQueryParams.toString();
            // --- AKHIR PERBAIKAN ---

            return (
              <Link
                // 3. TERAPKAN KE HREF
                href={`/watch/${item.episodeId}?${queryString}`}
                key={item.id}
                className="group relative" // Tambahkan 'relative' untuk overlay
                // Tambahkan semua event handler
                onContextMenu={(e) => handleContextMenu(e, item)}
                onTouchStart={(e) => handleTouchStart(e, item)}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                onClick={handleClick}
              >
                {/* --- BLOK LOADING STATE (Tidak berubah) --- */}
                {isCurrentlyDeleting && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-black/70 backdrop-blur-sm">
                    <span className="text-white text-sm animate-pulse">
                      Menghapus...
                    </span>
                  </div>
                )}
                {/* --- AKHIR BLOK LOADING --- */}

                {/* Beri opacity jika sedang dihapus (Tidak berubah) */}
                <div className={`
                  aspect-video relative overflow-hidden rounded-lg
                  ${isCurrentlyDeleting ? 'opacity-50' : ''}
                `}>
                  <Image
                    src={item.image || 'https://placehold.co/600x400/252736/FFFFFF/png?text=No+Image'}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <h3 className={`
                  text-sm font-semibold mt-2 group-hover:text-pink-500
                  ${isCurrentlyDeleting ? 'opacity-50' : ''}
                `}>
                  {item.title}
                </h3>
                <p className={`
                  text-xs text-gray-400 capitalize
                  ${isCurrentlyDeleting ? 'opacity-50' : ''}
                `}>
                  {formatEpisodeId(item.episodeId)}
                </p>
              </Link>
            );
          })}
        </div>
      )}

      {/* Tampilkan menu jika 'menu' state tidak null (Tidak berubah) */}
      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          onClose={closeMenu}
          onDelete={handleDelete}
          isDeleting={!!deletingId} // Kirim true jika deletingId tidak null
        />
      )}
    </>
  );
}