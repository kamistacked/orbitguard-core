import type { OrbitalObject } from '../types/orbital';

// Local FastAPI backend endpoint
const BACKEND_URL = "http://127.0.0.1:8000/api/constellation";

// Fallback seed catalog (renders 10 satellites immediately if backend is still starting)
const FALLBACK_FLEET: OrbitalObject[] = [
  {
    name: "ISS (ZARYA)",
    noradId: "25544",
    type: "Satellite",
    risk: "LOW",
    color: 0x00f3ff,
    altitude: 418.5,
    latitude: 28.5,
    longitude: 77.2,
    inclination: 51.64,
    velocity: 7.66,
    position: [1.06, 0.2, 0.3],
    orbitPath: []
  },
  {
    name: "TIANGONG",
    noradId: "48274",
    type: "Satellite",
    risk: "LOW",
    color: 0x00f3ff,
    altitude: 389.2,
    latitude: 31.2,
    longitude: 121.4,
    inclination: 41.47,
    velocity: 7.68,
    position: [0.95, 0.45, 0.2],
    orbitPath: []
  },
  {
    name: "STARLINK-1007",
    noradId: "44713",
    type: "Satellite",
    risk: "LOW",
    color: 0xffffff,
    altitude: 550.0,
    latitude: 53.1,
    longitude: -1.2,
    inclination: 53.05,
    velocity: 7.59,
    position: [0.8, 0.6, -0.4],
    orbitPath: []
  },
  {
    name: "STARLINK-30122",
    noradId: "58210",
    type: "Satellite",
    risk: "LOW",
    color: 0xffffff,
    altitude: 549.2,
    latitude: -34.6,
    longitude: -58.4,
    inclination: 43.0,
    velocity: 7.59,
    position: [-0.7, -0.6, 0.5],
    orbitPath: []
  },
  {
    name: "COSMOS 2251 DEBRIS",
    noradId: "34111",
    type: "Debris",
    risk: "HIGH",
    color: 0xff3344,
    altitude: 785.4,
    latitude: 72.1,
    longitude: 45.2,
    inclination: 74.03,
    velocity: 7.45,
    position: [0.4, 1.05, 0.3],
    orbitPath: []
  },
  {
    name: "FENGYUN 1C DEBRIS",
    noradId: "30118",
    type: "Debris",
    risk: "HIGH",
    color: 0xff3344,
    altitude: 845.1,
    latitude: -65.2,
    longitude: 140.1,
    inclination: 98.6,
    velocity: 7.41,
    position: [-0.3, -1.02, 0.45],
    orbitPath: []
  },
  {
    name: "IRIDIUM 33 DEBRIS",
    noradId: "33842",
    type: "Debris",
    risk: "HIGH",
    color: 0xffaa00,
    altitude: 770.3,
    latitude: 12.8,
    longitude: -80.1,
    inclination: 86.4,
    velocity: 7.46,
    position: [1.02, 0.15, -0.5],
    orbitPath: []
  },
  {
    name: "CZ-6A ROCKET BODY",
    noradId: "54236",
    type: "Rocket Body",
    risk: "MEDIUM",
    color: 0xa855f7,
    altitude: 810.0,
    latitude: 42.0,
    longitude: 15.0,
    inclination: 98.8,
    velocity: 7.43,
    position: [0.65, 0.85, 0.25],
    orbitPath: []
  },
  {
    name: "HUBBLE SPACE TELESCOPE",
    noradId: "20580",
    type: "Satellite",
    risk: "LOW",
    color: 0x00f3ff,
    altitude: 535.0,
    latitude: 18.2,
    longitude: -65.3,
    inclination: 28.47,
    velocity: 7.59,
    position: [0.98, 0.32, -0.4],
    orbitPath: []
  },
  {
    name: "ENVISAT",
    noradId: "27386",
    type: "Debris",
    risk: "HIGH",
    color: 0xff3344,
    altitude: 765.0,
    latitude: -15.4,
    longitude: 32.1,
    inclination: 98.5,
    velocity: 7.47,
    position: [-0.95, -0.25, 0.45],
    orbitPath: []
  }
];

export async function fetchOrbitalData(): Promise<OrbitalObject[]> {
  try {
    const res = await fetch(BACKEND_URL);
    if (!res.ok) throw new Error("Backend response error");
    const json = await res.json();

    // Map FastAPI backend objects to frontend OrbitalObject schema
    if (json && Array.isArray(json.objects) && json.objects.length > 0) {
      return json.objects.map((obj: any): OrbitalObject => ({
        name: obj.name || `OBJECT-${obj.norad_id}`,
        noradId: String(obj.norad_id),
        type: obj.type === 'DEBRIS' ? 'Debris' : obj.type === 'STARLINK' ? 'Satellite' : 'Satellite',
        risk: obj.type === 'DEBRIS' ? 'HIGH' : 'LOW',
        color: obj.type === 'DEBRIS' ? 0xff3344 : 0x00f3ff,
        altitude: obj.current_state?.geodetic?.altitude_km ?? 500,
        latitude: obj.current_state?.geodetic?.latitude ?? 0,
        longitude: obj.current_state?.geodetic?.longitude ?? 0,
        inclination: 51.6,
        velocity: Math.sqrt(
            Math.pow(obj.current_state?.velocity_km_s?.vx || 7.5, 2) +
            Math.pow(obj.current_state?.velocity_km_s?.vy || 0, 2) +
            Math.pow(obj.current_state?.velocity_km_s?.vz || 0, 2)
        ),
        position: [
          obj.current_state?.threejs_coords?.x || 1.1,
          obj.current_state?.threejs_coords?.y || 0,
          obj.current_state?.threejs_coords?.z || 0
        ],
        orbitPath: obj.orbit_path_points || []
      }));
    }

    return FALLBACK_FLEET;
  } catch (err) {
    console.warn("FastAPI offline or unreachable, deploying initial fleet:", err);
    return FALLBACK_FLEET;
  }
}

export default fetchOrbitalData;