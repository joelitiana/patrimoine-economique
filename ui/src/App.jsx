import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatrimoinePage from './components/PatrimoinePage.jsx';
import PossessionPage from './components/PossessionPage.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<PatrimoinePage />} />
                <Route path="/possessions" element={<PossessionPage />} />
            </Routes>
        </Router>
    );
}

export default App;
