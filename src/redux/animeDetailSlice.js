import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAnimeDetail = createAsyncThunk(
    'animeDetail/fetchAnimeDetail',
    async (slug, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://api.sankavollerei.com/anime/anime/${slug}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Gagal memuat detail anime');
        }
    }
);

const animeDetailSlice = createSlice({
    name: 'animeDetail',
    initialState: {
        data: null,
        loading: false,
        error: null,
        firstEpisodeSlug: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnimeDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAnimeDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                
                // Ekstrak slug episode pertama
                if (action.payload.data?.episode_lists && action.payload.data.episode_lists.length > 0) {
                    const firstEpisode = action.payload.data.episode_lists[0];
                    const episodeUrl = firstEpisode.slug.split('/');
                    state.firstEpisodeSlug = episodeUrl[episodeUrl.length - 1];
                }
            })
            .addCase(fetchAnimeDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default animeDetailSlice.reducer;