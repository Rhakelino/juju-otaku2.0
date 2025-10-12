'use client'; // <-- Komponen ini interaktif, jadi harus 'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function SearchInput() {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    // Mencegah form me-reload halaman
    e.preventDefault(); 
    
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      // Jika input kosong, jangan lakukan apa-apa
      return;
    }

    // Gunakan encodeURIComponent untuk memastikan keyword aman untuk URL
    const encodedKeyword = encodeURIComponent(trimmedKeyword);
    
    // --- DIKEMBALIKAN KE METODE SLUG ---
    // Sesuai dengan permintaan Postman yang berhasil
    router.push(`/search/${encodedKeyword}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md mx-auto my-8">
      <div className="relative">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Cari judul anime..."
          className="w-full bg-neutral-800 border-2 border-neutral-700 text-white rounded-full py-3 pl-5 pr-14 focus:outline-none focus:border-pink-500 transition"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition"
          aria-label="Cari"
        >
          <MagnifyingGlassIcon className="h-6 w-6" />
        </button>
      </div>
    </form>
  );
}

