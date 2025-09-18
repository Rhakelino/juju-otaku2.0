// src/redux/animeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks untuk fetching data
export const fetchHomeAnime = createAsyncThunk(
    'anime/fetchHomeAnime',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('https://api.sankavollerei.com/anime/home');
            return response.data?.data?.ongoing_anime || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch ongoing anime');
        }
    }
);

export const fetchCompleteAnime = createAsyncThunk(
    'anime/fetchCompleteAnime',
    async (page = 1, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://api.sankavollerei.com/anime/complete-anime/${page}`);
            return response.data?.completeAnimeData || 
                   response.data?.data?.completeAnimeData || 
                   response.data?.anime || 
                   response.data?.data?.anime || 
                   [];
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch complete anime');
        }
    }
);

export const searchAnime = createAsyncThunk(
    'anime/searchAnime',
    async (query, { rejectWithValue }) => {
        if (!query.trim()) {
            return [];
        }
        
        try {
            const response = await axios.get(`https://api.sankavollerei.com/anime/search/${query}`);
            return (response.data?.data || response.data || [])
                .map(animeData => ({
                    slug: animeData.slug,
                    title: animeData.title,
                    poster: animeData.poster,
                    current_episode: animeData.episode || null,
                    release_day: animeData.genres?.[0]?.name || 'Unknown',
                    newest_release_date: animeData.year || null,
                    type: animeData.genres?.[0]?.name || 'Unknown'
                }));
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to search anime');
        }
    }
);

const animeSlice = createSlice({
    name: 'anime',
    initialState: {
        ongoingAnime: [],
        completeAnime: [],
        searchResults: [],
        loading: {
            home: false,
            complete: false,
            search: false
        },
        error: {
            home: null,
            complete: null,
            search: null
        }
    },
    reducers: {
        clearSearchResults: (state) => {
            state.searchResults = [];
        }
    },
    extraReducers: (builder) => {
        // Home Anime Reducers
        builder.addCase(fetchHomeAnime.pending, (state) => {
            state.loading.home = true;
            state.error.home = null;
        });
        builder.addCase(fetchHomeAnime.fulfilled, (state, action) => {
            state.loading.home = false;
            state.ongoingAnime = action.payload;
        });
        builder.addCase(fetchHomeAnime.rejected, (state, action) => {
            state.loading.home = false;
            state.error.home = action.payload;
        });

        // Complete Anime Reducers
        builder.addCase(fetchCompleteAnime.pending, (state) => {
            state.loading.complete = true;
            state.error.complete = null;
        });
        builder.addCase(fetchCompleteAnime.fulfilled, (state, action) => {
            state.loading.complete = false;
            state.completeAnime = action.payload;
        });
        builder.addCase(fetchCompleteAnime.rejected, (state, action) => {
            state.loading.complete = false;
            state.error.complete = action.payload;
        });

        // Search Anime Reducers
        builder.addCase(searchAnime.pending, (state) => {
            state.loading.search = true;
            state.error.search = null;
        });
        builder.addCase(searchAnime.fulfilled, (state, action) => {
            state.loading.search = false;
            state.searchResults = action.payload;
        });
        builder.addCase(searchAnime.rejected, (state, action) => {
            state.loading.search = false;
            state.error.search = action.payload;
            state.searchResults = [];
        });
    }
});

export const { clearSearchResults } = animeSlice.actions;
export default animeSlice.reducer;