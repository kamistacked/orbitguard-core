import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import axios from 'axios';
import { EarthScene } from './components/EarthScene';
import { Radio, ShieldAlert, Crosshair, AlertTriangle } from 'lucide-react';

const API_ENDPOINT = 'http://localhost:8000/api/constellation';

export default function App() {
    const [data, setData] = useState(null);
    const [selectedId, setSelectedId] = useState(25544);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const res = await axios.get(API_ENDPOINT);
            setData(res.data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Engine offline');
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 8000);
        return () => clearInterval(interval);
    }, []);

    const activeObj = data?.objects?.find((o) => o.norad_id === selectedId) || data?.objects?.[0];
    const closestPass = data?.conjunctions?.[0];

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#030712' }}>
            {/* 3D Scene */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <Canvas camera={{ position: [0, 1.8, 2.8], fov: 45 }}>
                    <EarthScene constellation={data} selectedId={selectedId} onSelect={setSelectedId} />
                </Canvas>
            </div>

            {/* Header */}
            <header style={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 10, display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, backgroundColor: 'rgba(17, 24, 39, 0.85)', padding: '8px 16px', borderRadius: 12, border: '1px solid #374151', pointerEvents: 'auto' }}>
                    <ShieldAlert style={{ width: 24, height: 24, color: '#38bdf8' }} />
                    <div>
                        <h1 style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', margin: 0, letterSpacing: 1 }}>ORBITGUARD AI</h1>
                        <p style={{ color: '#9ca3af', fontSize: 10, fontFamily: 'monospace', margin: 0 }}>MULTI-OBJECT CONJUNCTION ENGINE</p>
                    </div>
                </div>
                <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.85)', padding: '6px 12px', borderRadius: 8, border: '1px solid #374151', fontSize: 12, fontFamily: 'monospace', color: error ? '#ef4444' : '#10b981', pointerEvents: 'auto' }}>
                    ● {error ? 'ENGINE OFFLINE' : 'CONSTELLATION TRACKING ACTIVE'}
                </div>
            </header>

            {/* Active Target Card */}
            {activeObj && (
                <aside style={{ position: 'absolute', bottom: 24, left: 24, zIndex: 10, width: 320, backgroundColor: 'rgba(17, 24, 39, 0.9)', border: '1px solid #374151', borderRadius: 16, padding: 16, color: '#fff', fontFamily: 'monospace', fontSize: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, borderBottom: '1px solid #374151', paddingBottom: 8 }}>
                        <Radio style={{ width: 16, height: 16, color: activeObj.type === 'DEBRIS' ? '#ef4444' : '#38bdf8' }} />
                        <span style={{ fontWeight: 'bold' }}>SELECTED TARGET</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#9ca3af' }}>NAME:</span>
                            <span style={{ fontWeight: 'bold' }}>{activeObj.name}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#9ca3af' }}>TYPE:</span>
                            <span style={{ color: activeObj.type === 'DEBRIS' ? '#ef4444' : '#38bdf8' }}>{activeObj.type}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#9ca3af' }}>ALTITUDE:</span>
                            <span style={{ color: '#10b981' }}>{activeObj.current_state.geodetic.altitude_km} km</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#9ca3af' }}>LAT / LON:</span>
                            <span>{activeObj.current_state.geodetic.latitude}°, {activeObj.current_state.geodetic.longitude}°</span>
                        </div>
                    </div>
                </aside>
            )}

            {/* Collision Risk Monitor */}
            {closestPass && (
                <aside style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 10, width: 320, backgroundColor: 'rgba(17, 24, 39, 0.9)', border: '1px solid #374151', borderRadius: 16, padding: 16, color: '#fff', fontFamily: 'monospace', fontSize: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, borderBottom: '1px solid #374151', paddingBottom: 8 }}>
                        <AlertTriangle style={{ width: 16, height: 16, color: closestPass.risk_level === 'CRITICAL' ? '#ef4444' : '#f59e0b' }} />
                        <span style={{ fontWeight: 'bold' }}>CLOSEST CONJUNCTION</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#9ca3af' }}>PAIR:</span>
                            <span style={{ fontSize: 10 }}>{closestPass.asset_a} ↔ {closestPass.asset_b}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#9ca3af' }}>RANGE:</span>
                            <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{closestPass.distance_km} km</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#9ca3af' }}>RISK STATUS:</span>
                            <span style={{ color: closestPass.risk_level === 'CRITICAL' ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                {closestPass.risk_level}
              </span>
                        </div>
                    </div>
                </aside>
            )}
        </div>
    );
}