// SearchPackages.js

import React from 'react';
import PackageDetails from './PackageDetails';

function SearchPackages({ className }) {
  // Add state to track whether to show details
  const [showDetails, setShowDetails] = React.useState(false);

  // Function to toggle the details
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className={className}>
      <h2>Search Packages</h2>

      {/* Your search functionality here */}

      {/* Button to toggle details */}
      <button onClick={toggleDetails}>
        {showDetails ? 'Hide Details' : 'Show Details'}
      </button>

      {/* Render details conditionally */}
      {showDetails && <PackageDetails className="details" />}
    </div>
  );
}

export default SearchPackages;
