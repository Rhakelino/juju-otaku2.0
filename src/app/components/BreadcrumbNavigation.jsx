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
    <nav className="flex items-center text-sm text-neutral-400 mb-4" aria-label="Breadcrumb">
      {/* Kita gunakan 'flex-wrap' agar rapi di HP jika jalurnya panjang */}
      <ol className="inline-flex items-center space-x-1 md:space-x-2 flex-wrap">
        
        {/* --- Bagian Home (Selalu ada) --- */}
        <li className="inline-flex items-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-pink-400 hover:text-pink-500 hover:underline"
          >
            <HomeIcon className="h-4 w-4 mr-2" />
            Home
          </Link>
        </li>

        {/* --- Bagian Dinamis (dari props 'crumbs') --- */}
        {crumbs.map((crumb, index) => {
          // Cek apakah ini item TERAKHIR di dalam array
          const isLastItem = index === crumbs.length - 1;

          return (
            <li key={index}>
              <div className="flex items-center">
                <ChevronRightIcon className="h-4 w-4 text-neutral-500" />
                
                {/* Jika BUKAN item terakhir, buat sebagai Link
                  Jika INI item terakhir, buat sebagai Teks
                */}
                {!isLastItem ? (
                  <Link
                    href={crumb.href}
                    className="ml-1 md:ml-2 text-pink-400 hover:text-pink-500 hover:underline"
                  >
                    {crumb.title}
                  </Link>
                ) : (
                  <span className="ml-1 md:ml-2 font-medium text-neutral-100">
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