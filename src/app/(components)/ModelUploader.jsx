"use client";

import axios from 'axios';
import { useState } from 'react';

const ModelUploader = ({ setModelFiles }) => {
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const filePath = response.data.path;
        const fileURL = `${window.location.origin}${filePath}`;
        const fileType = file.name.split('.').pop();  // gets 'gltf' or 'obj' based on file extension
        setModelFiles([{ url: fileURL, name: file.name, type: fileType }]);
        setUploadStatus('File uploaded successfully.');
      } else {
        setUploadStatus('File upload failed: ' + response.data.error);
        console.error('File upload failed:', response.data.error);
      }
    } catch (error) {
      setUploadStatus('Error uploading file: ' + (error.response ? error.response.data.error : error.message));
      console.error('Error uploading file:', error.response ? error.response.data.error : error.message);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".gltf, .obj" />
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default ModelUploader;

