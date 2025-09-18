import { configureStore } from '@reduxjs/toolkit';
import animeReducer from './animeSlice';
import animeDetailReducer from './animeDetailSlice';
import watchAnimeReducer from './watchAnimeSlice';

export const store = configureStore({
    reducer: {
        anime: animeReducer,
        animeDetail: animeDetailReducer,
        watchAnime: watchAnimeReducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false
        })
});