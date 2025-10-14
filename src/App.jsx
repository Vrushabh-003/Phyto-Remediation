import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import LogsPage from './components/LogsPage'; // Import new page
import RecommendationPage from './components/RecommendationPage'; // Import new page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="/recommendation/:logId" element={<RecommendationPage />} />      </Routes>
    </Router>
  );
}

export default App;