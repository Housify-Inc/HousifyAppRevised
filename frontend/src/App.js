import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/RegisterForm/RegisterForm';
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
        <Route path="/tenant-home" element ={<TenantDashboard/>} />
        <Route path="/landlord-home" element ={<LandloardDashboard/>} />
        <Route path="" element={<LoginForm />} />
        {/* {userType === 'Tenant' && (
          <Route path="/home" element={<TenantDashboard />} />
        )}
        {userType === 'LandLord' && (
          <Route path="/home" element={<LandloardDashboard />} />
        )} */}
      </Routes>
    </Router>
  );
}

export default App;
