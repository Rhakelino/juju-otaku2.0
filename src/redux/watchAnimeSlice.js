import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchEpisodeDetails = createAsyncThunk(
    'watchAnime/fetchEpisodeDetails',
    async (slug, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://api.sankavollerei.com/anime/episode/${slug}`);
            const data = response.data?.data;
            
            // Persiapkan data tambahan
            const episodesData = data?.additional_info?.episodeList || [];
            const sortedEpisodes = episodesData.sort((a, b) => parseInt(a.title) - parseInt(b.title));
            
            return {
                ...data,
                sortedEpisodes: sortedEpisodes
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Gagal memuat episode anime');
        }
    }
);

export const fetchStreamingUrl = createAsyncThunk(
    'watchAnime/fetchStreamingUrl',
    async ({ resolutionIndex, serverIndex, qualities }, { rejectWithValue }) => {
        try {
            if (!qualities || qualities.length === 0) {
                throw new Error('Streaming qualities tidak tersedia');
            }
            
            const selectedQuality = qualities[resolutionIndex];
            if (!selectedQuality) {
                throw new Error('Resolusi tidak ditemukan');
            }
            
            const serverList = selectedQuality.serverList;
            if (!serverList || serverList.length === 0) {
                throw new Error('Server streaming tidak tersedia');
            }
            
            const selectedServer = serverList[serverIndex];
            if (!selectedServer) {
                throw new Error('Server tidak ditemukan');
            }

            const serverId = selectedServer.serverId;
            const res = await axios.get(`https://www.sankavollerei.com/anime/server/${serverId}`);
            
            if (!res.data.url) {
                throw new Error('Gagal mengambil URL streaming');
            }

            return {
                url: res.data.url,
                resolutionIndex,
                serverIndex
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const watchAnimeSlice = createSlice({
    name: 'watchAnime',
    initialState: {
        data: null,
        loading: false,
        error: null,
        episodeList: [],
        streamingUrl: null,
        selectedResolutionIndex: 0,
        selectedServerIndex: 0,
        filteredQualities: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch Episode Details
        builder.addCase(fetchEpisodeDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchEpisodeDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.episodeList = action.payload.sortedEpisodes;
            
            // Filter qualities
            const qualities = action.payload.stream_servers?.qualities || [];
            state.filteredQualities = qualities.filter(q => q.title !== '360p');
        })
        .addCase(fetchEpisodeDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Fetch Streaming URL
        builder.addCase(fetchStreamingUrl.pending, (state) => {
            state.streamingUrl = null;
        })
        .addCase(fetchStreamingUrl.fulfilled, (state, action) => {
            state.streamingUrl = action.payload.url;
            state.selectedResolutionIndex = action.payload.resolutionIndex;
            state.selectedServerIndex = action.payload.serverIndex;
        })
        .addCase(fetchStreamingUrl.rejected, (state, action) => {
            state.error = action.payload;
            state.streamingUrl = null;
        });
    }
});

export default watchAnimeSlice.reducer;