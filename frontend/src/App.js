// src/App.js

import React from 'react';
import SignIn from './pages/SignIn';
import Dashboard from './pages/TenantDashboard';

function App() {
  return (
    <div className="App">
      <Dashboard/>
      <SignIn/>
    </div>
  );
}

export default App;
