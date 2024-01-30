import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/RegisterForm/RegisterForm';
import ForgotPasswordForm from './Components/ForgotPasswordForm/ForgotPasswordForm';
import HomePage from './Components/HomePage/HomePage';
import TentantDashboard from './Pages/TenantDashboard';
import LandLoardDashboard from './Pages/LandloardDashboard';
function App() {
  console.log('Rendering App component');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/home" element={<TentantDashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;

