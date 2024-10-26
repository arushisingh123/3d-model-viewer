"use client";
import { Suspense, useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree, extend  } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Html } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';

extend({ PlaneGeometry: THREE.PlaneGeometry });


const Model = ({ file, type, materialType, animationSpeed }) => {
  const obj = useLoader(type === 'gltf' ? GLTFLoader : OBJLoader, file);
  const { scene } = useThree();
  const [selected, setSelected] = useState(new Set());
  const basicMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xff0266 }), []);
  const standardMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x00ff00 }), []);
  const meshRef = useRef();


  useEffect(() => {
    obj.load
    const model = obj.scene || obj;
    model.position.set(-10,-5,0); 
    model.scale.set(1, 1, 1); 
    scene.add(model);


    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = materialType === 'basic' ? basicMaterial : standardMaterial;
        child.material = material;
        child.userData.selectable = true;  
        child.castShadow = true; // Enable shadows for the model
        child.receiveShadow = true; // Allow model to receive shadows
      }
    });


    return () => scene.remove(model);
  }, [obj, scene, materialType, basicMaterial, standardMaterial]);

  useFrame(() => {
    selected.forEach(mesh => {
      mesh.rotation.y += animationSpeed;
    });
  });


  const toggleSelection = (mesh) => {
    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(mesh)) {
        newSet.delete(mesh);
      } else {
        newSet.add(mesh);
      }
      return newSet;
    });
  };

  const handleClick = (event) => {
    if (event.object.userData.selectable) {
      toggleSelection(event.object);
    }
  };

  return <primitive 
  object={obj.scene || obj} 
  onClick={handleClick} 
  dispose={null}/>;
};
const CameraControls = ({ resetCameraFlag, setResetCameraFlag }) => {
  const { camera } = useThree();

  useEffect(() => {
    if (resetCameraFlag) {
      camera.position.set(3, 3, 3); 
      camera.updateProjectionMatrix();
      setResetCameraFlag(false); 
    }
  }, [resetCameraFlag, camera, setResetCameraFlag]);
  
  return null;
};

const Scene = ({ modelFiles, materialType, animationSpeed, resetCameraFlag, setResetCameraFlag }) => {
  const mainModelFile = modelFiles?.find(file => file.type === 'gltf' || file.type === 'obj');
const fileType = mainModelFile?.type; 
console.log('model', modelFiles);
  return (
    <Canvas shadows style={{ height: '90vh', width: '100vw' }}>
      <Suspense fallback={<Html center>Loading...</Html>}>
        <PerspectiveCamera makeDefault fov={75} position={[3, 3, 3]} />
        <ambientLight intensity={0.3} />
        <spotLight position={[10, 10, 10]} intensity={1.5} castShadow 
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005} // Adjust bias to prevent shadow artifacts
        />
        <OrbitControls target={[0, 0, 0]} enablePan={true} enableZoom={true} enableRotate={true} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <shadowMaterial opacity={0.5} />
        </mesh>
        <Environment preset="sunset" background/>
        {modelFiles.map(file => (
          <Model key={file.url} file={file.url} type={file.type} materialType={materialType} animationSpeed={animationSpeed}/>
        ))}
        <CameraControls resetCameraFlag={resetCameraFlag} setResetCameraFlag={setResetCameraFlag} />
      </Suspense>
    </Canvas>
  );
};

export default Scene;
