export interface OrbitalObject {
  id: string
  name: string
  noradId: string

  type:
    | 'Satellite'
    | 'Debris'
    | 'Rocket Body'
    | 'Unknown'

  latitude: number
  longitude: number
  altitude: number
  velocity: number
  inclination: number
  period: number

  status:
    | 'active'
    | 'inactive'
    | 'unknown'

  tle: {
    line1: string
    line2: string
  }

  color: number
  size: number
  phase: number

  risk:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH'
}