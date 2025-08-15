import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Box, Sphere, Cylinder, useGLTF, Html } from '@react-three/drei';
import { Eye, RotateCcw, ZoomIn, ZoomOut, Move3D, Info } from 'lucide-react';

// 3D Artifact Component
function Artifact3D({ type = 'pottery', position = [0, 0, 0], scale = 1, color = '#8B4513' }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  const renderArtifact = () => {
    switch (type) {
      case 'pottery':
        return (
          <Cylinder
            ref={meshRef}
            args={[0.8, 1.2, 2, 16]}
            position={position}
            scale={scale}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <meshStandardMaterial color={hovered ? '#CD853F' : color} />
          </Cylinder>
        );
      case 'sculpture':
        return (
          <Box
            ref={meshRef}
            args={[1.5, 2.5, 1]}
            position={position}
            scale={scale}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <meshStandardMaterial color={hovered ? '#A0522D' : color} />
          </Box>
        );
      case 'jewelry':
        return (
          <Sphere
            ref={meshRef}
            args={[0.5, 16, 16]}
            position={position}
            scale={scale}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <meshStandardMaterial color={hovered ? '#FFD700' : '#DAA520'} metalness={0.8} roughness={0.2} />
          </Sphere>
        );
      default:
        return (
          <Box
            ref={meshRef}
            args={[1, 1, 1]}
            position={position}
            scale={scale}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <meshStandardMaterial color={hovered ? '#CD853F' : color} />
          </Box>
        );
    }
  };

  return (
    <group>
      {renderArtifact()}
      {hovered && (
        <Html position={[position[0], position[1] + 2, position[2]]}>
          <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
            Click to view details
          </div>
        </Html>
      )}
    </group>
  );
}

// Museum Room Component
function MuseumRoom() {
  return (
    <group>
      {/* Floor */}
      <Box args={[20, 0.1, 20]} position={[0, -2, 0]}>
        <meshStandardMaterial color="#8B7355" />
      </Box>
      
      {/* Walls */}
      <Box args={[20, 8, 0.2]} position={[0, 2, -10]}>
        <meshStandardMaterial color="#F5F5DC" />
      </Box>
      <Box args={[0.2, 8, 20]} position={[-10, 2, 0]}>
        <meshStandardMaterial color="#F5F5DC" />
      </Box>
      <Box args={[0.2, 8, 20]} position={[10, 2, 0]}>
        <meshStandardMaterial color="#F5F5DC" />
      </Box>
      
      {/* Ceiling */}
      <Box args={[20, 0.2, 20]} position={[0, 6, 0]}>
        <meshStandardMaterial color="#DDBEA9" />
      </Box>
      
      {/* Display Pedestals */}
      <Cylinder args={[1, 1, 1]} position={[-4, -1.5, -4]}>
        <meshStandardMaterial color="#696969" />
      </Cylinder>
      <Cylinder args={[1, 1, 1]} position={[4, -1.5, -4]}>
        <meshStandardMaterial color="#696969" />
      </Cylinder>
      <Cylinder args={[1, 1, 1]} position={[0, -1.5, 4]}>
        <meshStandardMaterial color="#696969" />
      </Cylinder>
    </group>
  );
}

// Main AR/VR Viewer Component
export default function ARVRViewer({ artifact, onClose }) {
  const [viewMode, setViewMode] = useState('3d'); // '3d', 'ar', 'vr'
  const [showInfo, setShowInfo] = useState(false);
  const [cameraPosition, setCameraPosition] = useState([5, 5, 5]);

  const artifacts = [
    { id: 1, type: 'pottery', position: [-4, -1, -4], name: 'Ancient Ethiopian Pottery' },
    { id: 2, type: 'sculpture', position: [4, -0.5, -4], name: 'Stone Sculpture' },
    { id: 3, type: 'jewelry', position: [0, -1, 4], name: 'Traditional Jewelry' },
  ];

  const resetCamera = () => {
    setCameraPosition([5, 5, 5]);
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('3d')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              viewMode === '3d' ? 'bg-amber-600 text-white' : 'bg-white text-gray-800'
            }`}
          >
            <Move3D size={20} />
            <span>3D View</span>
          </button>
          <button
            onClick={() => setViewMode('ar')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              viewMode === 'ar' ? 'bg-amber-600 text-white' : 'bg-white text-gray-800'
            }`}
          >
            <Eye size={20} />
            <span>AR Mode</span>
          </button>
          <button
            onClick={() => setViewMode('vr')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              viewMode === 'vr' ? 'bg-amber-600 text-white' : 'bg-white text-gray-800'
            }`}
          >
            <Eye size={20} />
            <span>VR Mode</span>
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2"
          >
            <Info size={20} />
            <span>Info</span>
          </button>
          <button
            onClick={resetCamera}
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2"
          >
            <RotateCcw size={20} />
            <span>Reset</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: cameraPosition, fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          {/* Environment */}
          <Environment preset="warehouse" />
          
          {/* Museum Room */}
          <MuseumRoom />
          
          {/* Artifacts */}
          {artifacts.map((art) => (
            <Artifact3D
              key={art.id}
              type={art.type}
              position={art.position}
              scale={1}
            />
          ))}
          
          {/* Museum Title */}
          <Text
            position={[0, 4, -9.5]}
            fontSize={1}
            color="#8B4513"
            anchorX="center"
            anchorY="middle"
          >
            Ethiopian Heritage Virtual Museum
          </Text>
          
          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-20 right-4 w-80 bg-white rounded-lg shadow-lg p-6 z-10">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Virtual Museum Guide</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700">Navigation:</h4>
              <ul className="text-sm text-gray-600 mt-1">
                <li>• Left click + drag: Rotate view</li>
                <li>• Right click + drag: Pan view</li>
                <li>• Scroll: Zoom in/out</li>
                <li>• Hover over artifacts for details</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Artifacts:</h4>
              <ul className="text-sm text-gray-600 mt-1">
                {artifacts.map((art) => (
                  <li key={art.id}>• {art.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">View Modes:</h4>
              <ul className="text-sm text-gray-600 mt-1">
                <li>• 3D View: Interactive 3D exploration</li>
                <li>• AR Mode: Augmented reality overlay</li>
                <li>• VR Mode: Virtual reality experience</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      <div className="absolute bottom-4 left-4 text-white">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm">3D Museum Loaded</span>
        </div>
      </div>

      {/* View Mode Indicator */}
      <div className="absolute bottom-4 right-4 text-white">
        <div className="bg-black bg-opacity-50 px-3 py-1 rounded-lg">
          <span className="text-sm">Mode: {viewMode.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}