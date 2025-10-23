import React, { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Card, InfoBox, LoadingSpinner } from '../App';
import { useGemini } from '../hooks/useGemini';
import { generateConfiguratorDescription } from '../services/geminiService';

const RotatingShape: React.FC<{ color: string }> = ({ color }) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    useFrame((_, delta) => {
        meshRef.current.rotation.x += delta * 0.2;
        meshRef.current.rotation.y += delta * 0.2;
    });
    return (
        <mesh ref={meshRef} scale={1.5}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
        </mesh>
    );
};

const ConfiguratorView: React.FC = () => {
    const [color, setColor] = useState('#00BFFF');
    const { data: description, isLoading, execute: fetchDescription } = useGemini(generateConfiguratorDescription);
    
    const generateNewDescription = useCallback((newColor: string) => {
        fetchDescription({ color: newColor, shape: 'Icosahedron' });
    }, [fetchDescription]);

    useEffect(() => {
        generateNewDescription(color);
    }, []);
    
    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColor(e.target.value);
    };

    const handleGenerateClick = () => {
        generateNewDescription(color);
    };

    return (
        <Card className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="w-full h-80 rounded-lg bg-gray-200 dark:bg-gray-900">
                    <Suspense fallback={<LoadingSpinner />}>
                        <Canvas camera={{ position: [0, 0, 3.5], fov: 75 }}>
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} intensity={1.5} />
                            <RotatingShape color={color} />
                            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                        </Canvas>
                    </Suspense>
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold mb-4">Product Configurator</h2>
                    <div className="mb-4">
                        <label htmlFor="colorPicker" className="block text-sm font-medium text-brand-text-secondary-light dark:text-gray-400 mb-2">Select Color</label>
                        <input id="colorPicker" type="color" value={color} onChange={handleColorChange} className="w-full h-10 p-1 bg-gray-200 dark:bg-gray-800 border border-brand-border-light dark:border-brand-border rounded-md cursor-pointer"/>
                    </div>
                    {isLoading && !description ? (
                         <div className="space-y-2 animate-pulse min-h-[72px]">
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                        </div>
                    ) : (
                        <p className="leading-relaxed min-h-[72px]">{description || ''}</p>
                    )}
                    <button onClick={handleGenerateClick} className="mt-4 w-full bg-brand-blue text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-80 transition-colors disabled:opacity-50" disabled={isLoading}>
                        {isLoading ? 'Generating...' : 'Generate New Description'}
                    </button>
                </div>
            </div>
            <InfoBox>This component uses react-three-fiber to render an interactive 3D object. Gemini generates marketing copy based on your configuration.</InfoBox>
        </Card>
    );
};

export default ConfiguratorView;
