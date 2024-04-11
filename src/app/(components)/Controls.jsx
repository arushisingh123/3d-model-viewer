"use client";

export default function Controls({ onMaterialTypeChange, onResetCamera, onStartAnimation, onStopAnimation, onSpeedChange }) {
  return (
    <div style={{ position: 'absolute', top: 20, left: 20 }}>
      <button onClick={() => onMaterialTypeChange('basic')}>Basic Material</button>
      &nbsp;
      <button onClick={() => onMaterialTypeChange('standard')}>Standard Material</button>
      &nbsp;
      <button onClick={onResetCamera}>Reset Camera</button>
      &nbsp;
      <button onClick={onStartAnimation}>Start Animation</button>
      &nbsp;
      <button onClick={onStopAnimation}>Stop Animation</button>
      &nbsp;
      <input type="range" min="0.01" max="0.1" step="0.01" defaultValue="0.05" onChange={(e) => onSpeedChange(parseFloat(e.target.value))} />
    </div>
  );
}
