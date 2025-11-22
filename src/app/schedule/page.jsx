"use client";

import React, { useState, useEffect } from 'react';
import Navigation from '@/app/components/Navigation';
import ResponsiveBreadcrumb from '@/app/components/ResponsiveBreadcrumb';
import AnimeCard from '@/app/components/AnimeCard';
import Header from '@/app/components/Header';

const DAYS = [
  { key: 'minggu', label: 'Minggu' },
  { key: 'senin', label: 'Senin' },
  { key: 'selasa', label: 'Selasa' },
  { key: 'rabu', label: 'Rabu' },
  { key: 'kamis', label: 'Kamis' },
  { key: "jum'at", label: "Jum'at" },
  { key: 'sabtu', label: 'Sabtu' },
  { key: 'random', label: 'Random' }
];

async function fetchSchedule() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/schedule`);
    if (!response.ok) {
      throw new Error('Gagal mengambil data schedule');
    }
    const result = await response.json();
    return result.schedule || {};
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return {};
  }
}

export default function SchedulePage() {
  const [schedule, setSchedule] = useState({});
  const [activeDay, setActiveDay] = useState('minggu');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSchedule = async () => {
      setIsLoading(true);
      const data = await fetchSchedule();
      setSchedule(data);
      setIsLoading(false);
    };
    loadSchedule();
  }, []);

  const breadcrumbs = [
    { title: 'Schedule', href: '/schedule' }
  ];

  const currentAnimes = schedule[activeDay] || [];

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Navigation />
        <ResponsiveBreadcrumb crumbs={breadcrumbs} />
        <Header title="Jadwal Anime" />

        {/* Tab Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max pb-2">
            {DAYS.map((day) => (
              <button
                key={day.key}
                onClick={() => setActiveDay(day.key)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeDay === day.key
                    ? 'bg-pink-600 text-white shadow-lg'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-neutral-400">Memuat jadwal...</p>
            </div>
          </div>
        ) : currentAnimes.length > 0 ? (
          <>
            <div className="mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-pink-500">
                {DAYS.find(d => d.key === activeDay)?.label}
                <span className="text-neutral-400 text-base ml-2">
                  ({currentAnimes.length} anime)
                </span>
              </h2>
            </div>

            {/* Anime Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {currentAnimes.map((anime, index) => (
                <AnimeCard
                  key={anime.slug || index}
                  title={anime.title}
                  image={anime.poster}
                  slug={anime.slug}
                  type={anime.type}
                  episode={anime.episode}
                  statusOrDay={anime.status_or_day}
                  priority={index < 10}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-center">
              <p className="text-neutral-400 text-lg">
                Tidak ada anime untuk hari ini
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
