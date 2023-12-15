import React, { useState } from 'react';

const UploadPackage = () => {
  const [packageName, setPackageName] = useState('');
  const [file, setFile] = useState(null);
  const [b64file, setb64file] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      getBase64(e.target.files[0]).then((result) => {
        console.log("base 64 result");
        console.log(result);
        setb64file(result);
        // console.log("File Is", result);
      })
    }
  };

  const getBase64 = (file) => {
    return new Promise(resolve => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        console.log("Called", reader);
        baseURL = reader.result;
        console.log(baseURL);
        resolve(baseURL);
      };
      return fileInfo;
    });
  };

  const handleUpload = async () => {
    if (file) {
      console.log("Uploading file...");

      const formData = new FormData();
      formData.append("file", file);
      formData.append('name', packageName);
      formData.append("Content", b64file);

      try {
        const result = await fetch("http://3.12.123.204:3000/package", {
          method: "POST",
          body: formData,
          headers: {
            // Add your X-Authorization header here with the appropriate token value
            'x-authorization': '0',
          },
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
