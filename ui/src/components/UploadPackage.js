// src/components/UploadPackage.js
import React, { useState } from 'react';

const UploadPackage = () => {
  const [packageName, setPackageName] = useState('');

  const handleUpload = () => {
    // Implement package upload logic
    console.log(`Uploading package: ${packageName}`);
  };

  return (
    <div>
      <h2>Upload Package</h2>
      <input
        type="text"
        placeholder="Package Name"
        value={packageName}
        onChange={(e) => setPackageName(e.target.value)}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default UploadPackage;
