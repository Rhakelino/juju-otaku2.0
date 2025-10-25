import React from 'react';
import Navigation from './components/Navigation';

const NotFound = () => {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-4">
      {/* Container utama untuk centering */}

      <h1 className="text-4xl md:text-6xl font-bold mb-4 text-red-500">
        404 - Halaman Tidak Ditemukan!
      </h1>
      <p className="text-lg md:text-xl text-neutral-300 mb-8 text-center max-w-xl">
        Maaf, halaman yang Anda cari mungkin telah dihapus, namanya diubah, atau tidak pernah ada.
      </p>

      <img
        src="./images/rem.gif"
        alt="Page Not Found GIF"
        className="max-w-xs md:max-w-md rounded-lg shadow-lg"
      />
      <Navigation />
    </div>
  );
}

export default NotFound;