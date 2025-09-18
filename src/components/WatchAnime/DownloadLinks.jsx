import React from 'react';

const DownloadLinks = ({ downloadUrls }) => {
  // Normalisasi berbagai bentuk struktur dari API
  const buildGroupsFromOtakudesu = (formatArray = []) => (
    formatArray.map((quality) => ({
      title: quality.resolution || quality.title,
      links: (quality.urls || []).map((l) => ({ title: l.provider || l.title, url: l.url }))
    }))
  );

  const buildGroupsFromQualities = (qualities = []) => (
    qualities.map((q) => ({
      title: q.title || q.resolution,
      links: (q.urls || q.serverList || []).map((l) => ({ title: l.title || l.provider || l.serverName, url: l.url }))
    }))
  );

  let groups = [];
  if (downloadUrls?.mkv?.length) {
    groups = groups.concat(buildGroupsFromOtakudesu(downloadUrls.mkv));
  }
  if (downloadUrls?.mp4?.length) {
    groups = groups.concat(buildGroupsFromOtakudesu(downloadUrls.mp4));
  }
  if (Array.isArray(downloadUrls)) {
    groups = groups.concat(buildGroupsFromQualities(downloadUrls));
  }
  if (downloadUrls?.qualities?.length) {
    groups = groups.concat(buildGroupsFromQualities(downloadUrls.qualities));
  }

  return (
    <div className="bg-neutral-800 rounded-lg m-4 p-4">
      <h2 className="text-lg font-bold mb-4">Download Links</h2>
      {groups.length === 0 ? (
        <p className="text-neutral-400">Tidak ada link download.</p>
      ) : (
        groups.map((group, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-semibold text-neutral-300 mb-2">{group.title}</h3>
            <div className="grid grid-cols-2 gap-2">
              {group.links.map((link, linkIndex) => (
                <a
                  key={linkIndex}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-neutral-700 text-white py-2 px-3 rounded text-center text-sm hover:bg-neutral-600"
                >
                  {link.title}
                </a>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DownloadLinks;