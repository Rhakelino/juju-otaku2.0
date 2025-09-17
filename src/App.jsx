import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import AnimeDetail from './Pages/AnimeDetail';
import WatchAnime from './Pages/WatchAnime';

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
    <Router>
      <ScrollToTop /> {/* Tambahkan komponen ini */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anime/:slug" element={<AnimeDetail />} />
        <Route path="/watch/:slug" element={<WatchAnime />} />
      </Routes>
    </Router>
  );
}

export default App;