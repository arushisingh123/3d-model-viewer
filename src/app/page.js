"use client";

import { useState } from 'react';
import Scene from './(components)/Scene';
import ModelUploader from './(components)/ModelUploader';
import Controls from './(components)/Controls';

export default function Home() {
  const [modelFiles, setModelFiles] = useState([]);
  const [materialType, setMaterialType] = useState('standard');
  const [animationSpeed, setAnimationSpeed] = useState(0.01);
  const [resetCameraFlag, setResetCameraFlag] = useState(false);

  console.log('modelfiles', modelFiles);

  return (
    <div className='container'>
      <header className="header">
        <h1 className="title">3D Model Viewer</h1>
        <ModelUploader setModelFiles={setModelFiles} />
      </header>
      {modelFiles.length > 0 && (
        <div className="canvas-container">
          <Scene
            modelFiles={modelFiles}
            materialType={materialType}
            animationSpeed={animationSpeed}
            resetCameraFlag={resetCameraFlag}
            setResetCameraFlag={setResetCameraFlag}
          />  
          <div className="controls-container">
          <Controls
            onMaterialTypeChange={setMaterialType}
            onResetCamera={() => setResetCameraFlag(true)}
            onStartAnimation={() => setAnimationSpeed(0.1)}
            onStopAnimation={() => setAnimationSpeed(0)}
            onSpeedChange={setAnimationSpeed}
          />
          </div>
          </div>
      )}
    </div>
  );
}
