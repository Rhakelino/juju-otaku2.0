"use client";

import Link from 'next/link'; // 1. Gunakan Link dari Next.js
import { usePathname } from 'next/navigation'; // 2. Impor hook usePathname
import React from 'react';

/**
 * Komponen untuk tombol navigasi "Next" dan "Previous"
 * @param {object} props
 * @param {number} props.currentPage - Halaman saat ini
 * @param {boolean} props.hasNextPage - Apakah ada halaman selanjutnya
 */
const PaginationControls = ({ currentPage, hasNextPage }) => {
  // 3. Dapatkan path URL saat ini (cth: "/populer" atau "/movies")
  const pathname = usePathname(); 
  
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  const baseStyle = "px-6 py-2 rounded-full font-semibold transition-colors";
  const activeStyle = "bg-pink-600 text-white hover:bg-pink-700";
  const disabledStyle = "bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-60";

  return (
    <div className="flex justify-center items-center gap-6 my-12">
      {/* Tombol Previous */}
      <Link
        // 4. Buat URL secara dinamis menggunakan pathname
        href={`${pathname}?page=${prevPage}`}
        className={`${baseStyle} ${currentPage <= 1 ? disabledStyle : activeStyle}`}
        aria-disabled={currentPage <= 1}
        tabIndex={currentPage <= 1 ? -1 : undefined}
        // Trik Anda untuk mencegah klik pada Link sudah bagus
        onClick={(e) => { if (currentPage <= 1) e.preventDefault(); }}
      >
        « Previous
      </Link>

      {/* Tampilan Halaman */}
      <span className="font-bold text-lg text-white">
        Halaman {currentPage}
      </span>

      {/* Tombol Next */}
      <Link
        // 4. Buat URL secara dinamis menggunakan pathname
        href={`${pathname}?page=${nextPage}`}
        className={`${baseStyle} ${!hasNextPage ? disabledStyle : activeStyle}`}
        aria-disabled={!hasNextPage}
        tabIndex={!hasNextPage ? -1 : undefined}
        onClick={(e) => { if (!hasNextPage) e.preventDefault(); }}
      >
        Next »
      </Link>
    </div>
  );
}

export default PaginationControls;