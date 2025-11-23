"use client";

import { useState, useEffect } from 'react';
import { FaTimes, FaDownload, FaMobile } from 'react-icons/fa';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if user already dismissed the prompt
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      return;
    }

    // Listen for the beforeinstallprompt event
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response to the install prompt: ${outcome}`);

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);

    // Save to localStorage that user has interacted
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="relative bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg shadow-2xl p-4 md:p-5">
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors p-1"
            aria-label="Dismiss"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-white/20 rounded-full flex-shrink-0">
              <FaMobile className="w-6 h-6 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-white font-bold text-base md:text-lg mb-1">
                Install JujuOtaku App
              </h3>
              <p className="text-white/90 text-sm">
                Install aplikasi untuk akses lebih cepat dan bisa digunakan offline!
              </p>
            </div>

            {/* Install Button */}
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 bg-white text-pink-600 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-pink-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
            >
              <FaDownload className="w-4 h-4" />
              <span className="hidden sm:inline">Install</span>
              <span className="sm:hidden">Install</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
