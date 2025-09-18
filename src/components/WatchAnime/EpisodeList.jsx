import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EpisodeList = ({ episodeList, slug }) => {
  const [showEpisodeList, setShowEpisodeList] = useState(false);

  return (
    <div className="bg-neutral-800 rounded-lg m-4">
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setShowEpisodeList(!showEpisodeList)}
      >
        <h2 className="text-lg font-bold">Daftar Episode</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 transform transition-transform ${showEpisodeList ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {showEpisodeList && (
        <div className="p-4 pt-0">
          {episodeList.map((episode) => (
            <Link
              key={episode.episodeId}
              to={`/watch/${episode.href.replace('/otakudesu/episode/', '')}`}
              className={`block py-3 px-4 mb-2 rounded ${slug === episode.href.replace('/otakudesu/episode/', '') ? 'bg-pink-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'}`}
            >
              Episode {episode.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default EpisodeList;