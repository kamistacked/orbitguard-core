import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { OrbitalObject } from './types/orbital';

interface EarthProps {
    orbitalObjects: OrbitalObject[];
    selectedObjectName: string | null;
    onObjectSelect: (object: OrbitalObject) => void;
}

const EARTH_RADIUS = 2.0;

export default function Earth({
                                  orbitalObjects,
                                  selectedObjectName,
                                  onObjectSelect,
                              }: EarthProps) {
    const mountRef = useRef<HTMLDivElement>(null);
    const satellitesGroupRef = useRef<THREE.Group | null>(null);
    const interactiveMeshesRef = useRef<{ mesh: THREE.Mesh; object: OrbitalObject }[]>([]);
    const onObjectSelectRef = useRef(onObjectSelect);

    // Keep latest callback ref without re-triggering effects
    useEffect(() => {
        onObjectSelectRef.current = onObjectSelect;
    }, [onObjectSelect]);

    // 1. INITIALIZE WEBGL SCENE EXACTLY ONCE
    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#020611');

        const camera = new THREE.PerspectiveCamera(
            45,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 2.5, 5.5);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enablePan = false;
        controls.minDistance = 2.6;
        controls.maxDistance = 12.0;
        controls.rotateSpeed = 0.6;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);

        const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
        dirLight1.position.set(10, 8, 5);
        scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0x446688, 0.5);
        dirLight2.position.set(-10, -5, -5);
        scene.add(dirLight2);

        // Earth Mesh
        const textureLoader = new THREE.TextureLoader();
        const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64);
        const earthMat = new THREE.MeshStandardMaterial({
            map: textureLoader.load(
                'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'
            ),
            roughness: 0.7,
            metalness: 0.1,
        });
        const earthMesh = new THREE.Mesh(earthGeo, earthMat);
        scene.add(earthMesh);

        // Atmosphere Glow Shell
        const atmosGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.015, 64, 64);
        const atmosMat = new THREE.MeshBasicMaterial({
            color: 0x00aaff,
            transparent: true,
            opacity: 0.12,
            side: THREE.BackSide,
        });
        scene.add(new THREE.Mesh(atmosGeo, atmosMat));

        // Starfield Background
        const starGeo = new THREE.BufferGeometry();
        const starCount = 2000;
        const starPositions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i++) {
            starPositions[i] = (Math.random() - 0.5) * 250;
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.6 });
        scene.add(new THREE.Points(starGeo, starMat));

        // Group dedicated to dynamic satellites
        const satellitesGroup = new THREE.Group();
        scene.add(satellitesGroup);
        satellitesGroupRef.current = satellitesGroup;

        // Raycaster for clicks
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const handleClick = (event: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const targets = interactiveMeshesRef.current.map((item) => item.mesh);
            const intersects = raycaster.intersectObjects(targets);

            if (intersects.length > 0) {
                const hit = interactiveMeshesRef.current.find((item) => item.mesh === intersects[0].object);
                if (hit) {
                    onObjectSelectRef.current(hit.object);
                }
            }
        };

        renderer.domElement.addEventListener('click', handleClick);

        // Animation Loop
        let animationFrameId: number;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            earthMesh.rotation.y += 0.0006;
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Resize Handler
        const handleResize = () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup once on unmount
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            renderer.domElement.removeEventListener('click', handleClick);
            controls.dispose();
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    // 2. DYNAMICALLY RE-RENDER ONLY SATELLITES & ORBITS (NO CANVAS RECREATION)
    useEffect(() => {
        const group = satellitesGroupRef.current;
        if (!group) return;

        // Clear previous satellite objects
        while (group.children.length > 0) {
            const child = group.children[0] as THREE.Mesh;
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach((m) => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
            group.remove(child);
        }
        interactiveMeshesRef.current = [];

        orbitalObjects.forEach((obj) => {
            const isSelected = selectedObjectName === obj.name;
            const latRad = (obj.latitude * Math.PI) / 180;
            const lonRad = (obj.longitude * Math.PI) / 180;
            const r = EARTH_RADIUS * (1.0 + obj.altitude / 6371.0);

            // Coordinates
            const x = -r * Math.cos(latRad) * Math.cos(lonRad);
            const y = r * Math.sin(latRad);
            const z = r * Math.cos(latRad) * Math.sin(lonRad);

            // 1. Orbit Loop
            const orbitPoints: THREE.Vector3[] = [];
            const segments = 80;
            const incRad = (obj.inclination * Math.PI) / 180;
            for (let i = 0; i <= segments; i++) {
                const u = (i / segments) * Math.PI * 2;
                orbitPoints.push(
                    new THREE.Vector3(
                        r * Math.cos(u),
                        r * Math.sin(u) * Math.sin(incRad),
                        r * Math.sin(u) * Math.cos(incRad)
                    )
                );
            }
            const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
            const orbitMat = new THREE.LineBasicMaterial({
                color: isSelected ? 0xffff00 : obj.color,
                transparent: true,
                opacity: isSelected ? 0.9 : 0.22,
            });
            group.add(new THREE.LineLoop(orbitGeo, orbitMat));

            // 2. Satellite Light Point
            const nodeColor = isSelected ? 0xffff00 : obj.color;
            const satGeo = new THREE.SphereGeometry(isSelected ? 0.04 : 0.024, 16, 16);
            const satMat = new THREE.MeshBasicMaterial({ color: nodeColor });
            const satMesh = new THREE.Mesh(satGeo, satMat);
            satMesh.position.set(x, y, z);
            group.add(satMesh);

            // 3. Glowing Halo
            const haloGeo = new THREE.SphereGeometry(isSelected ? 0.075 : 0.04, 12, 12);
            const haloMat = new THREE.MeshBasicMaterial({
                color: nodeColor,
                transparent: true,
                opacity: isSelected ? 0.5 : 0.22,
            });
            const haloMesh = new THREE.Mesh(haloGeo, haloMat);
            haloMesh.position.set(x, y, z);
            group.add(haloMesh);

            interactiveMeshesRef.current.push({ mesh: satMesh, object: obj });
        });
    }, [orbitalObjects, selectedObjectName]);

    return <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />;
}