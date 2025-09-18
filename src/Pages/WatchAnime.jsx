import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchEpisodeDetails, 
    fetchStreamingUrl 
} from '../redux/watchAnimeSlice';

// Import Components
import BackNavigation from '../components/common/BackNavigation';
import WatchAnimeMobileSkeleton from '../components/WatchAnime/SkeletonLoading/MobileSkeleton';
import WatchAnimeDesktopSkeleton from '../components/WatchAnime/SkeletonLoading/DesktopSkeleton';
import VideoPlayer from '../components/WatchAnime/VideoPlayer';
import ResolutionServerSelector from '../components/WatchAnime/ResolutionServerSelector';
import EpisodeList from '../components/WatchAnime/EpisodeList';
import DownloadLinks from '../components/WatchAnime/DownloadLinks';

function WatchAnime() {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { 
        data, 
        loading, 
        error, 
        episodeList, 
        streamingUrl, 
        selectedResolutionIndex, 
        selectedServerIndex,
        filteredQualities
    } = useSelector((state) => state.watchAnime);

    const [showEpisodeList, setShowEpisodeList] = React.useState(false);

    useEffect(() => {
        dispatch(fetchEpisodeDetails(slug));
    }, [dispatch, slug]);

    useEffect(() => {
        if (filteredQualities.length > 0) {
            dispatch(fetchStreamingUrl({
                resolutionIndex: 0, 
                serverIndex: 0, 
                qualities: filteredQualities
            }));
        }
    }, [dispatch, filteredQualities]);

    const handleResolutionChange = (e) => {
        const newResolutionIndex = parseInt(e.target.value);
        dispatch(fetchStreamingUrl({
            resolutionIndex: newResolutionIndex, 
            serverIndex: 0, 
            qualities: filteredQualities
        }));
    };

    const handleServerChange = (e) => {
        const newServerIndex = parseInt(e.target.value);
        dispatch(fetchStreamingUrl({
            resolutionIndex: selectedResolutionIndex, 
            serverIndex: newServerIndex, 
            qualities: filteredQualities
        }));
    };

    if (loading) return (
        <>
            <div className="lg:hidden">
                <WatchAnimeMobileSkeleton />
            </div>
            <div className="hidden lg:block">
                <WatchAnimeDesktopSkeleton />
            </div>
        </>
    );

    if (error) return (
        <div className="min-h-screen bg-neutral-900 text-red-500 flex justify-center items-center">
            {error}
        </div>
    );

    if (!data) return (
        <div className="min-h-screen bg-neutral-900 text-white flex justify-center items-center">
            Episode Not Found
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-900 text-white relative">
            {data.anime?.poster && (
                <div
                    className="fixed inset-0 bg-cover bg-center blur-xl opacity-30 -z-10"
                    style={{ backgroundImage: `url(${data.anime.poster})` }}
                />
            )}

            {/* Mobile View */}
            <div className="lg:hidden">
                <BackNavigation
                    animeData={data}
                    episode={data.episode}
                />

                <div className="relative">
                    <VideoPlayer
                        streamingUrl={streamingUrl}
                        animeData={data}
                    />

                    <p className="text-neutral-400 px-4 pt-4">{data.episode}</p>

                    <ResolutionServerSelector
                        filteredQualities={filteredQualities}
                        selectedResolutionIndex={selectedResolutionIndex}
                        selectedServerIndex={selectedServerIndex}
                        handleResolutionChange={handleResolutionChange}
                        handleServerChange={handleServerChange}
                    />

                    <EpisodeList
                        episodeList={episodeList}
                        slug={slug}
                        showEpisodeList={showEpisodeList}
                        setShowEpisodeList={setShowEpisodeList}
                    />

                    <DownloadLinks
                        downloadUrls={data.download_urls}
                    />
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block container mx-auto px-4 py-8">
                <BackNavigation
                    animeData={data}
                    episode={data.episode}
                />

                <div className="flex space-x-4">
                    <div className="w-3/4">
                        <VideoPlayer
                            streamingUrl={streamingUrl}
                            animeData={data}
                            isDesktop={true}
                        />

                        <h1 className="text-neutral-400 px-4 text-lg pt-4">{data.episode}</h1>

                        <ResolutionServerSelector
                            filteredQualities={filteredQualities}
                            selectedResolutionIndex={selectedResolutionIndex}
                            selectedServerIndex={selectedServerIndex}
                            handleResolutionChange={handleResolutionChange}
                            handleServerChange={handleServerChange}
                            isDesktop={true}
                        />
                    </div>

                    <div className="w-1/4 max-h-[600px] overflow-y-auto">
                        <div className="bg-neutral-800 rounded-lg p-4">
                            <h2 className="text-xl font-bold mb-4">Daftar Episode</h2>
                            {episodeList.map((episode) => (
                                <Link
                                    key={episode.episodeId}
                                    to={`/watch/${episode.href.replace('/otakudesu/episode/', '')}`}
                                    className={`block py-2 px-3 mb-2 rounded ${slug === episode.href.replace('/otakudesu/episode/', '') ? 'bg-pink-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'}`}
                                >
                                    Episode {episode.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <DownloadLinks
                    downloadUrls={data.download_urls}
                    isDesktop={true}
                />
            </div>
        </div>
    );
}

export default WatchAnime;