// src/components/PackageDetails.js
import React from 'react';
import { useParams } from 'react-router-dom';

const PackageDetails = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>Package Details</h2>
      <p>Package ID: {id}</p>
      {/* Add more content as needed */}
    </div>
  );
}

export default PackageDetails;
