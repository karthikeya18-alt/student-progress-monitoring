import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import Faculty from './pages/Faculty';
import Admin from './pages/Admin';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/StudentDashboard" element={<StudentDashboard />} />
      <Route path="/Faculty" element={<Faculty />} />
      <Route path="/Admin" element={<Admin />} />
    </Routes>
  );
};

export default App;