import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import AnimeDetail from './Pages/AnimeDetail';
import WatchAnime from './Pages/WatchAnime';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anime/:slug" element={<AnimeDetail />} />
        <Route path="/watch/:slug" element={<WatchAnime />} />
      </Routes>
    </Router>
  );
}

export default App;