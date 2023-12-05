import React, { useState } from 'react';

const PackageUploadForm = () => {
  const [packageName, setPackageName] = useState('');

  const handleUpload = () => {
    // Implement package upload logic using API service
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter package name"
        value={packageName}
        onChange={(e) => setPackageName(e.target.value)}
      />
      <button onClick={handleUpload}>Upload Package</button>
    </div>
  );
};

export default PackageUploadForm;
