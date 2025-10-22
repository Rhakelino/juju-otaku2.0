'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function SearchInput() {
  const router = useRouter();
  const searchRef = useRef()

  const handleSearch = (e) => {
    e.preventDefault();

    const keyword = searchRef.current.value

    if (keyword == "") {
      alert("ketik dulu dongo")
    } else if (keyword.trim() == "") {
      alert("jangan ngetik spasi juga dongo")
    } else {
      router.push(`/search/${keyword}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md my-8">
      <div className="relative">
        <input
          type="text"
          ref={searchRef}
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

