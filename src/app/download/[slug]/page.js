import Link from 'next/link';

// Fungsi untuk mengambil data download batch (versi bersih)
async function getBatchData(slug) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // Endpoint yang benar, tanpa '/anime' di depannya
  const fullUrl = `${apiUrl}/batch/${slug}`;

  const response = await fetch(fullUrl);

  if (!response.ok) {
    // Lemparkan error jika API mengembalikan status gagal
    throw new Error(`Gagal mengambil data download batch. Status: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}

export default async function DownloadPage({ params }) {
  const { slug } = params;
  
  try {
    const batchData = await getBatchData(slug);

    // Pengecekan jika data atau link download tidak ada
    if (!batchData || !batchData.downloadUrl || !batchData.downloadUrl.formats) {
      return (
        <div className="min-h-screen bg-neutral-900 text-white flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold mb-4">Download Links Not Found</h1>
          <p className="text-neutral-400 mb-8">Data ditemukan, tetapi tidak ada link download yang tersedia.</p>
          <Link href="/" className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition">
            Kembali ke Beranda
          </Link>
        </div>
      );
    }
    // Tampilan jika data berhasil didapatkan
    return (
      <div className="min-h-screen bg-neutral-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">{batchData.title}</h1>
            <p className="text-neutral-400">Download Batch Links</p>
          </div>

          {batchData.downloadUrl.formats.map((format, formatIndex) => (
            <div key={formatIndex} className="mb-8">
              <h2 className="text-2xl font-semibold text-pink-500 border-b-2 border-neutral-700 pb-2 mb-4">
                {format.title}
              </h2>
              {format.qualities.map((quality, qualityIndex) => (
                <div key={qualityIndex} className="bg-neutral-800 rounded-lg p-4 mb-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-4 sm:mb-0">
                      <h3 className="text-lg font-bold text-white">{quality.title}</h3>
                      <p className="text-sm text-neutral-400">Size: {quality.size}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {quality.urls.map((url, urlIndex) => (
                        <a
                          key={urlIndex}
                          href={url.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                          {url.title}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );

  } catch (error) {
    // Halaman error jika terjadi masalah saat fetching
    console.error("Error di halaman download:", error); // Tetap log error di server untuk maintenance
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4 text-red-500">Terjadi Kesalahan</h1>
        <p className="text-neutral-400 mb-8">Gagal memuat data download. Silakan coba lagi nanti.</p>
        <Link href="/" className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }
}

