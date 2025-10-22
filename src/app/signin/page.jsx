// app/signin/page.jsx
"use client";

import { getProviders, signIn } from "next-auth/react";
import { useState, useEffect } from "react";

// (Opsional) Impor ikon jika Anda mau
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function SignInPage() {
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    // Ambil daftar provider (Google, GitHub) saat komponen dimuat
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  if (!providers) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-white">Memuat...</p>
      </div>
    );
  }

  // Objek untuk ikon (opsional)
  const providerIcons = {
    Google: <FcGoogle size={24} />,
    GitHub: <FaGithub size={24} />,
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-sm p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white">
          Login ke Juju Otaku
        </h2>
        
        <div className="space-y-4">
          {/* Looping semua provider yang Anda daftarkan 
            di file route.js (Google, GitHub)
          */}
          {Object.values(providers).map((provider) => (
            <button
              key={provider.name}
              // Ini adalah fungsi utama untuk memicu login
              onClick={() => signIn(provider.id, { 
                callbackUrl: '/users/dashboard' // Redirect ke dashboard setelah login
              })}
              className={`
                w-full flex items-center justify-center gap-3 px-4 py-3 
                rounded-md font-semibold transition-colors duration-200 
                focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-offset-gray-800
                ${
                  provider.name === "Google"
                    ? "bg-white text-gray-700 hover:bg-gray-100 focus:ring-blue-500"
                    : "bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500"
                }
              `}
            >
              {providerIcons[provider.name]}
              <span>Sign in with {provider.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}