'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ContextMenu from './ContextMenu';

const HISTORY_CACHE_KEY = 'juju-otaku-history';

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
  const useDatabase = process.env.NEXT_PUBLIC_USE_DATABASE === 'true';

  const [items, setItems] = useState(initialHistory);
  const [menu, setMenu] = useState(null);
  const [deletingId, setDeletingId] = useState(null); 
  
  const timerRef = useRef(null);
  const wasLongPress = useRef(false);

  const closeMenu = () => setMenu(null);

  useEffect(() => {
    if (useDatabase) {
      return;
    }

    console.log("Mode DB nonaktif, memuat riwayat dari cache...");
    let cachedHistory = [];
    try {
      cachedHistory = JSON.parse(localStorage.getItem(HISTORY_CACHE_KEY)) || [];
      if (!Array.isArray(cachedHistory)) {
        cachedHistory = [];
      }
    } catch (e) {
      cachedHistory = [];
    }
    
    setItems(cachedHistory);
  }, [useDatabase]); 

  useEffect(() => {
    const handleClickOutside = () => closeMenu();
    if (menu) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [menu]);

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
    }, 700);
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

  const handleDelete = async () => {
    if (deletingId || !menu) return; 

    const itemToDelete = menu.item;
    setDeletingId(itemToDelete.id); 

    try {
      if (useDatabase) {
        const response = await fetch(`/api/history?id=${itemToDelete.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Gagal menghapus riwayat dari DB');
        }

      } else {
        let currentHistory = [];
        try {
          currentHistory = JSON.parse(localStorage.getItem(HISTORY_CACHE_KEY)) || [];
        } catch (e) {
          currentHistory = [];
        }
        
        const newHistory = currentHistory.filter(
          (item) => item.id !== itemToDelete.id
        );

        localStorage.setItem(HISTORY_CACHE_KEY, JSON.stringify(newHistory));
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
            const isCurrentlyDeleting = item.id === deletingId;

            const slug = item.animeId;
            const title = item.title;
            const image = item.image;
            
            const historyQueryParams = new URLSearchParams();
            if (slug) historyQueryParams.set('slug', slug);
            if (title) historyQueryParams.set('title', title);
            if (image) historyQueryParams.set('image', image);
            
            const queryString = historyQueryParams.toString();

            return (
              <Link
                href={`/watch/${item.episodeId}?${queryString}`}
                key={item.id || item.episodeId}
                className="group relative"
                onContextMenu={(e) => handleContextMenu(e, item)}
                onTouchStart={(e) => handleTouchStart(e, item)}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                onClick={handleClick}
              >
                {isCurrentlyDeleting && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-black/70 backdrop-blur-sm">
                    <span className="text-white text-sm animate-pulse">
                      Menghapus...
                    </span>
                  </div>
                )}

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

      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          onClose={closeMenu}
          onDelete={handleDelete}
          isDeleting={!!deletingId}
        />
      )}
    </>
  );
}