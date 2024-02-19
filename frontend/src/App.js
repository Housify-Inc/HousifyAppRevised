import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/RegisterForm/RegisterForm';
import ForgotPasswordForm from './Components/ForgotPasswordForm/ForgotPasswordForm';
import HomePage from './Components/HomePage/HomePage';
import TenantDashboard from './Pages/TenantDashboard';
import LandloardDashboard from './Pages/LandloardDashboard';

function App() {
  console.log('Rendering App component');
  const [userType, setUserType] = useState('');

  useEffect(() => {
    // Simulate user authentication or determine userType based on some logic
    setUserType('LandLord'); // Set userType to 'Tenant' for example
  }, []); // Empty dependency array to run only once when the component mounts

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        {userType === 'Tenant' && (
          <Route path="/home" element={<TenantDashboard />} />
        )}
        {userType === 'LandLord' && (
          <Route path="/home" element={<LandloardDashboard />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
