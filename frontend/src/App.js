// src/App.js

import React from 'react';
import SignIn from './Pages/SignIn';
import Dashboard from './Pages/TenantDashboard';

function App() {
  return (
    <div className="App">
      <Dashboard/>
      <SignIn/>
    </div>
  );
}

export default App;
