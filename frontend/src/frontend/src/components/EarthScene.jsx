import React, { useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls, Stars } from '@react-three/drei';

function OrbitPath({ points, color }) {
    const lineGeometry = useMemo(() => {
        if (!points || points.length === 0) return null;
        return new THREE.BufferGeometry().setFromPoints(
            points.map((p) => new THREE.Vector3(p.x, p.y, p.z))
        );
    }, [points]);

    if (!lineGeometry) return null;

    return (
        <primitive object={new THREE.Line(
            lineGeometry,
            new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.4 })
        )} />
    );
}

export function EarthScene({ constellation, selectedId, onSelect }) {
    return (
        <>
            <color attach="background" args={['#030712']} />
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 3, 5]} intensity={1.5} />
            <Stars radius={100} depth={50} count={3000} factor={4} fade />

            {/* Earth Body */}
            <mesh>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial color="#1e3a8a" roughness={0.7} metalness={0.1} />
            </mesh>

            {/* Atmospheric Glow */}
            <mesh>
                <sphereGeometry args={[1.02, 32, 32]} />
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} side={THREE.BackSide} />
            </mesh>

            {/* Render Orbit Paths & Space Objects */}
            {constellation?.objects?.map((obj) => {
                const isDebris = obj.type === 'DEBRIS';
                const isSelected = selectedId === obj.norad_id;
                const colorHex = isSelected ? '#10b981' : (isDebris ? '#ef4444' : '#38bdf8');
                const pos = obj.current_state?.threejs_coords;

                return (
                    <group key={obj.norad_id}>
                        <OrbitPath points={obj.orbit_path} color={colorHex} />
                        {pos && (
                            <group position={[pos.x, pos.y, pos.z]} onClick={() => onSelect(obj.norad_id)}>
                                <mesh>
                                    <sphereGeometry args={[isDebris ? 0.022 : 0.035, 16, 16]} />
                                    <meshStandardMaterial color={colorHex} emissive={colorHex} emissiveIntensity={0.8} />
                                </mesh>
                                {!isDebris && (
                                    <mesh rotation={[0, 0, Math.PI / 4]}>
                                        <boxGeometry args={[0.08, 0.005, 0.02]} />
                                        <meshStandardMaterial color="#94a3b8" />
                                    </mesh>
                                )}
                            </group>
                        )}
                    </group>
                );
            })}

            <OrbitControls enablePan={false} minDistance={1.4} maxDistance={6.0} dampingFactor={0.05} />
        </>
    );
}