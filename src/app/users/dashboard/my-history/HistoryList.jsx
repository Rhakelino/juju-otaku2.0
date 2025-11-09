'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ContextMenu from './ContextMenu';

// Ambil fungsi formatEpisodeId dari file halaman utama
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
  const [isDeleting, setIsDeleting] = useState(false);
  
  const timerRef = useRef(null);
  const wasLongPress = useRef(false);

  const closeMenu = () => setMenu(null);

  // Menutup menu jika ada klik di mana saja
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
    // Reset status long press
    wasLongPress.current = false;
    // Hapus timer lama jika ada
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // Mulai timer baru
    timerRef.current = setTimeout(() => {
      wasLongPress.current = true; // Tandai bahwa ini adalah long press
      // Tampilkan menu di posisi sentuhan
      setMenu({ x: e.touches[0].clientX, y: e.touches[0].clientY, item });
    }, 700); // 700ms untuk tahan lama
  };

  const handleTouchEnd = () => {
    // Jari diangkat, batalkan timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleTouchMove = () => {
    // Jari bergerak (scroll), batalkan timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  // Mencegah navigasi Link jika itu adalah long press
  const handleClick = (e) => {
    if (wasLongPress.current) {
      e.preventDefault(); // Batalkan navigasi
      wasLongPress.current = false; // Reset status
    }
  };

  // --- Handler untuk Hapus ---

  const handleDelete = async () => {
    if (isDeleting || !menu) return;

    setIsDeleting(true);
    const itemToDelete = menu.item;

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
      setIsDeleting(false);
      closeMenu();
    }
  };

  return (
    <>
      {items.length === 0 ? (
        <p>Kamu belum menonton. nonton dulu ya kids</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <Link
              href={`/watch/${item.episodeId}`}
              key={item.id}
              className="group"
              // Tambahkan semua event handler
              onContextMenu={(e) => handleContextMenu(e, item)}
              onTouchStart={(e) => handleTouchStart(e, item)}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
              onClick={handleClick}
            >
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <Image
                  src={item.image || 'https://placehold.co/600x400/252736/FFFFFF/png?text=No+Image'}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <h3 className="text-sm font-semibold mt-2 group-hover:text-pink-500">
                {item.title}
              </h3>
              <p className="text-xs text-gray-400 capitalize">
                {formatEpisodeId(item.episodeId)}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* Tampilkan menu jika 'menu' state tidak null */}
      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          onClose={closeMenu}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}