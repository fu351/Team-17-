// App.js

import React, { useState } from 'react';
import Home from './components/Home';
import UploadPackage from './components/UploadPackage';
import SearchPackages from './components/SearchPackages';
import './App.css';

function App() {
  const [currentTab, setCurrentTab] = useState('home');

  const renderComponent = () => {
    switch (currentTab) {
      case 'upload':
        return <UploadPackage className="upload" />;
      case 'search':
        return <SearchPackages className="search" />;
      default:
        return <Home className="home" />;
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">TEAM 17: PHASE 2</div>

      {/* Navigation buttons */}
      <div className="nav-buttons">
        <button onClick={() => setCurrentTab('home')}>Home</button>
        <button onClick={() => setCurrentTab('upload')}>Upload</button>
        <button onClick={() => setCurrentTab('search')}>Search</button>
      </div>

      {/* Component container */}
      <div className={`component-container ${currentTab}`}>
        {renderComponent()}
      </div>
    </div>
  );
}

export default App;
