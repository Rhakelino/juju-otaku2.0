// /src/app/sitemap.js (Hanya untuk halaman statis)

const BASE_URL = 'https://kaelnime.vercel.app'; 

export default function sitemap() {
  return [
    {
      url: BASE_URL, // Halaman utama (Home /)
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/animelist`, // Daftar Anime
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/populer`, // Populer
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/movie`, // Movie
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/genres`, // Genre
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/schedule`, // Schedule
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];
}