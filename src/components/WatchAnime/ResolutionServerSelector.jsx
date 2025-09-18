import React from 'react';

const ResolutionServerSelector = ({
  filteredQualities,
  selectedResolutionIndex,
  selectedServerIndex,
  handleResolutionChange,
  handleServerChange
}) => (
  <div className="p-4 space-y-4 bg-neutral-900">
    <div>
      <label className="block mb-1 font-semibold" htmlFor="resolution-select">Pilih Resolusi:</label>
      <select
        id="resolution-select"
        className="w-full bg-neutral-800 text-white p-2 rounded"
        value={selectedResolutionIndex}
        onChange={handleResolutionChange}
      >
        {filteredQualities.map((quality, index) => (
          <option key={quality.title} value={index}>
            {quality.title}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="block mb-1 font-semibold" htmlFor="server-select">Pilih Server:</label>
      <select
        id="server-select"
        className="w-full bg-neutral-800 text-white p-2 rounded"
        value={selectedServerIndex}
        onChange={handleServerChange}
      >
        {filteredQualities[selectedResolutionIndex]?.serverList.map((server, index) => (
          <option key={server.serverId} value={index}>
            {server.title}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default ResolutionServerSelector;