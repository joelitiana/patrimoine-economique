import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PossessionPage from './components/possessionPage';
import PatrimoinePage from './components/PatrimoinePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PossessionPage />} />
    
        <Route path="/patrimoine" element={<PatrimoinePage />} />
      </Routes>
    </Router>
  );
}

export default App;
