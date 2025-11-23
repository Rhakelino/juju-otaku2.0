import Link from 'next/link';
import { FaWifi } from 'react-icons/fa';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* WiFi Off Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <FaWifi className="w-24 h-24 text-neutral-700" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-1 bg-pink-500 rotate-45 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4 text-white">
          Tidak Ada Koneksi
        </h1>

        {/* Description */}
        <p className="text-neutral-400 text-lg mb-8">
          Sepertinya Anda sedang offline. Periksa koneksi internet Anda dan coba lagi.
        </p>

        {/* Retry Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Coba Lagi
        </Link>

        {/* Additional Info */}
        <div className="mt-8 text-sm text-neutral-500">
          <p>Tips: Install aplikasi JujuOtaku untuk akses offline yang lebih baik</p>
        </div>
      </div>
    </div>
  );
}
