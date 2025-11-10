// File: src/app/dashboard/history/ContextMenu.js
'use client';

import React from 'react';

export default function ContextMenu({
  x,
  y,
  onClose,
  onDelete,
  isDeleting, // Menerima boolean
}) {
  return (
    <>
      {/* Overlay untuk menutup menu saat diklik di luar */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
      />
      
      {/* Konten Menu */}
      <div
        className="fixed z-50 bg-neutral-800 text-white rounded-lg shadow-lg py-2"
        style={{ top: y, left: x }}
      >
        <button
          onClick={onDelete}
          disabled={isDeleting} // Nonaktifkan tombol saat menghapus
          className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-neutral-700 disabled:opacity-50"
        >
          {isDeleting ? 'Sedang menghapus...' : 'Hapus Riwayat'}
        </button>
      </div>
    </>
  );
}