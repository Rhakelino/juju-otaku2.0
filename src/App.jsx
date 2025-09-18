import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux'; // Tambahkan import ini
import { store } from './redux/store'; // Sesuaikan path ke store Anda

import Home from './Pages/Home';
import AnimeDetail from './Pages/AnimeDetail';
import WatchAnime from './Pages/WatchAnime';
import AnimeDownload from './Pages/AnimeDownload';

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

function App() {
  return (
    <Provider store={store}> {/* Tambahkan Provider di sini */}
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anime/:slug" element={<AnimeDetail />} />
          <Route path="/watch/:slug" element={<WatchAnime />} />
          <Route path="/anime-download/:batchSlug" element={<AnimeDownload />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;