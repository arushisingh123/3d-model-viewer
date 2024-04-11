"use client";

// ModelUploader.jsx
import { useMemo, useState } from 'react';

export default function ModelUploader({ setModelFiles }) {
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        const fileURLs = files.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name,
            type: file.name.split('.').pop()
        }));

        setModelFiles(fileURLs);
        setUploadStatus('Files uploaded successfully.');
    };

    return (
        <>
            <div>
                <input
                    type="file"
                    onChange={handleFileChange}
                    multiple
                    accept=".obj, .gltf"
                />
                <label>Upload .obj or .gltf files</label>
            </div>
            <p>{uploadStatus}</p>
        </>
    );
}


