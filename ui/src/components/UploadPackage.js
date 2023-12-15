import React, { useState } from 'react';

const UploadPackage = () => {
  const [packageName, setPackageName] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      console.log("Uploading file...");

      const formData = new FormData();
      formData.append("package", file);
      formData.append('name', packageName);

      try {
        const result = await fetch("http://3.12.123.204:3000/package", {
          method: "POST",
          body: formData,
        });

        const data = await result.json();

        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h2>Upload Package</h2>
      <label htmlFor="name">Package Name:</label>
      <input
        type="text"
        id="name"
        value={packageName}
        onChange={(e) => setPackageName(e.target.value)}
        required
      />
      <input
        type="file"
        id="file"
        name="file"
        onChange={handleFileChange}
        accept=".zip"
        required
        aria-label="Choose file"
      />
      <button type="button" onClick={handleUpload} aria-label="Upload package">
        Upload
      </button>
    </div>
  );
};

export default UploadPackage;
