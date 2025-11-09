// File: src/app/dashboard/history/HistoryList.js
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ContextMenu from './ContextMenu';

// Fungsi helper untuk format slug, sekarang ada di client
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

  // Efek untuk menutup menu
  useEffect(() => {
    const handleClickOutside = () => closeMenu();
    if (menu) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [menu]);

  // Handler untuk Klik Kanan (Desktop)
  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY, item });
  };

  // --- Handler untuk Tahan Lama (Mobile) ---
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

  // Mencegah navigasi Link jika itu adalah long press
  const handleClick = (e) => {
    if (wasLongPress.current) {
      e.preventDefault();
      wasLongPress.current = false;
    }
  };

  // --- Handler untuk Hapus ---
  const handleDelete = async () => {
    if (deletingId || !menu) return; // Jangan lakukan apa-apa jika sedang menghapus

    const itemToDelete = menu.item;
    setDeletingId(itemToDelete.id); // Atur ID item yang sedang dihapus

    try {
      const response = await fetch(`/api/history?id=${itemToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus riwayat');
      }

      // Hapus item dari state UI
      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== itemToDelete.id)
      );
      
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus riwayat.');
    } finally {
      setDeletingId(null); // Reset state loading
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

            return (
              <Link
                href={`/watch/${item.episodeId}`}
                key={item.id}
                className="group relative" // Tambahkan 'relative' untuk overlay
                // Tambahkan semua event handler
                onContextMenu={(e) => handleContextMenu(e, item)}
                onTouchStart={(e) => handleTouchStart(e, item)}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                onClick={handleClick}
              >
                {/* --- BLOK LOADING STATE --- */}
                {isCurrentlyDeleting && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-black/70 backdrop-blur-sm">
                    <span className="text-white text-sm animate-pulse">
                      Menghapus...
                    </span>
                  </div>
                )}
                {/* --- AKHIR BLOK LOADING --- */}

                {/* Beri opacity jika sedang dihapus */}
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

      {/* Tampilkan menu jika 'menu' state tidak null */}
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