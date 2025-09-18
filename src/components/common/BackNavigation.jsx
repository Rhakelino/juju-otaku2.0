import React from 'react';
import { Link } from 'react-router-dom';

const BackNavigation = ({ animeData, episode }) => (
    <div className="mb-4 flex items-center space-x-4 pt-5 px-2 text-neutral-300">
        <Link
            onClick={(e) => { e.preventDefault(); window.history.back(); }}
            className="text-white hover:text-pink-500 transition-colors"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </Link>
        <div className="text-sm flex items-center space-x-2">
            <Link to="/" className="hover:text-pink-500 transition-colors">Home</Link>
            <span>•</span>
            <Link
                to={`/`}
                className="hover:text-pink-500 transition-colors"
            >
                {animeData.anime?.title || 'Anime'}
            </Link>
            <span>•</span>
            <span className="text-pink-500">{episode || 'Episode'}</span>
        </div>
    </div>
);

export default BackNavigation;