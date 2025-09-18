import React from 'react';

const DownloadLinks = ({ downloadUrls }) => {
  if (!downloadUrls?.mp4) return null;

  return (
    <div className="bg-neutral-800 rounded-lg m-4 p-4">
      <h2 className="text-lg font-bold mb-4">Download Links</h2>
      {downloadUrls.mp4.map((quality, index) => (
        <div key={index} className="mb-4">
          <h3 className="font-semibold text-neutral-300 mb-2">{quality.resolution}</h3>
          <div className="grid grid-cols-2 gap-2">
            {quality.urls.map((link, linkIndex) => (
              <a
                key={linkIndex}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-700 text-white py-2 px-3 rounded text-center text-sm hover:bg-neutral-600"
              >
                {link.provider}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DownloadLinks;