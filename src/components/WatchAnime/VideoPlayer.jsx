import React from 'react';

const VideoPlayer = ({ streamingUrl, animeData }) => (
  <>
    {(streamingUrl || animeData.stream_url) ? (
      <div className="bg-black rounded-b-lg overflow-hidden">
        <iframe
          src={streamingUrl || animeData.stream_url}
          className="w-full aspect-video"
          allowFullScreen
          title={animeData.episode}
        />
      </div>
    ) : (
      <div className="bg-neutral-800 rounded-b-lg h-[200px] flex justify-center items-center">
        Video Tidak Tersedia
      </div>
    )}
  </>
);

export default VideoPlayer;