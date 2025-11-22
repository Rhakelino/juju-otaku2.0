// app/components/BreadcrumbNavigation.js
"use client"

import Link from 'next/link';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import React from 'react';

/**
 * Komponen Breadcrumb Navigasi Dinamis
 * @param {object} props
 * @param {Array<{title: string, href: string}>} props.crumbs - Array of breadcrumb objects.
 * - Halaman terakhir dalam array akan otomatis menjadi teks (tidak bisa diklik).
 */
const BreadcrumbNavigation = ({ crumbs = [] }) => {
  return (
    <nav className="flex items-center text-sm sm:text-base text-neutral-400 mb-4 sm:mb-6" aria-label="Breadcrumb">
      {/* Kita gunakan 'flex-wrap' agar rapi di HP jika jalurnya panjang */}
      <ol className="inline-flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 flex-wrap">
        
        {/* --- Bagian Home (Selalu ada) --- */}
        <li className="inline-flex items-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-pink-400 hover:text-pink-500 hover:underline transition-colors"
          >
            <HomeIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
            <span className="text-sm sm:text-base">Home</span>
          </Link>
        </li>

        {/* --- Bagian Dinamis (dari props 'crumbs') --- */}
        {crumbs.map((crumb, index) => {
          // Cek apakah ini item TERAKHIR di dalam array
          const isLastItem = index === crumbs.length - 1;

          return (
            <li key={index}>
              <div className="flex items-center">
                <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-500" />
                
                {/* Jika BUKAN item terakhir, buat sebagai Link
                  Jika INI item terakhir, buat sebagai Teks
                */}
                {!isLastItem ? (
                  <Link
                    href={crumb.href}
                    className="ml-1.5 sm:ml-2 text-sm sm:text-base text-pink-400 hover:text-pink-500 hover:underline transition-colors"
                  >
                    {crumb.title}
                  </Link>
                ) : (
                  <span className="ml-1.5 sm:ml-2 text-sm sm:text-base font-medium text-neutral-100">
                    {crumb.title}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default BreadcrumbNavigation;