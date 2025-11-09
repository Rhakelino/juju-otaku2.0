import AnimeCard from '@/app/components/AnimeCard';
import SearchInput from '@/app/components/SearchInput';
import Navigation from '@/app/components/Navigation';

async function searchAnime(slug) {
  if (!slug) return [];

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const searchUrl = `${apiUrl}/search/${slug}`;

    const response = await fetch(searchUrl);

    if (!response.ok) {
      console.error(`API error for slug "${slug}": Status ${response.status}`);
      return [];
    }

    const result = await response.json();
    return result.animes || [];
  } catch (error) {
    console.error("Gagal total saat mengambil hasil pencarian:", error);
    return [];
  }
}

export default async function SearchPage({ params: ParamsPromise }) {
  const params = await ParamsPromise;
  const { slug } = params;
  const keyword = decodeURIComponent(slug);
  const searchResults = await searchAnime(slug);

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Navigation />
          <SearchInput />
          <h1 className="text-3xl md:text-4xl font-bold">
            {'Hasil Pencarian untuk: '}
            <span className="text-pink-500">{keyword}</span>
          </h1>
        </div>
        {searchResults && searchResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {searchResults.map((anime) => {
              const slugParts = anime.slug?.split('/').filter(Boolean);
              const processedSlug = slugParts?.pop() || '';
              return (
                <AnimeCard
                  key={processedSlug || anime.title}
                  slug={processedSlug}
                  type={anime.type}
                  title={anime.title}
                  image={anime.poster}
                  episode={anime.episode}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-neutral-400">
              {'Yah, tidak ketemu...'}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}