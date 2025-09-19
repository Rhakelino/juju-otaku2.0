import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux'; // Tambahkan import ini
import { store } from './redux/store'; // Sesuaikan path ke store Anda

import Home from './Pages/Home';
import SearchPage from './Pages/SearchPage';
import GenrePage from './Pages/GenrePage';
import SchedulePage from './Pages/SchedulePage';
import AnimeDetail from './Pages/AnimeDetail';
import WatchAnime from './Pages/WatchAnime';
import AnimeDownload from './Pages/AnimeDownload';
import GenresPage from './Pages/GenresPage';

// Komponen ScrollToTop
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Opsional: tambahkan smooth scrolling
    });
  }, [pathname]);

  return null;
};

function usePreventSelection() {
  useEffect(() => {
    const preventSelection = (e) => {
      e.preventDefault();
    };

    // Berbagai event untuk mencegah seleksi
    document.addEventListener('selectstart', preventSelection);
    document.addEventListener('contextmenu', preventSelection);

    // Mencegah copy
    document.addEventListener('copy', preventSelection);

    // Mencegah cut
    document.addEventListener('cut', preventSelection);

    // Mencegah drag
    document.addEventListener('dragstart', preventSelection);

    return () => {
      document.removeEventListener('selectstart', preventSelection);
      document.removeEventListener('contextmenu', preventSelection);
      document.removeEventListener('copy', preventSelection);
      document.removeEventListener('cut', preventSelection);
      document.removeEventListener('dragstart', preventSelection);
    };
  }, []);
}

function usePreventCursorChange() {
  useEffect(() => {
    document.body.style.cursor = 'default';
    
    return () => {
      document.body.style.cursor = 'auto'; // Kembalikan ke default saat komponen di-unmount
    };
  }, []);
}


function App() {
  usePreventSelection();
  usePreventCursorChange();
  return (
    <Provider store={store}> {/* Tambahkan Provider di sini */}
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/genre/:slug" element={<GenrePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/anime/:slug" element={<AnimeDetail />} />
          <Route path="/watch/:slug" element={<WatchAnime />} />
          <Route path="/anime-download/:batchSlug" element={<AnimeDownload />} />
          <Route path="/genres" element={<GenresPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;