import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import Earth from './Earth'

import {
  fetchOrbitalData,
} from './data/orbitalData'

import type {
  OrbitalObject,
} from './types/orbital'

import './App.css'

function App() {
  const [
    orbitalObjects,
    setOrbitalObjects,
  ] = useState<
    OrbitalObject[]
  >([])

  const [
    selectedObjectName,
    setSelectedObjectName,
  ] = useState<
    string | null
  >(null)

  const [
    searchQuery,
    setSearchQuery,
  ] = useState('')

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null)

  const [
    utcTime,
    setUtcTime,
  ] = useState('')

  /*
   * UTC CLOCK
   */

  useEffect(() => {
    const updateTime = () => {
      setUtcTime(
        new Date()
          .toISOString()
          .substring(11, 19)
      )
    }

    updateTime()

    const interval =
      window.setInterval(
        updateTime,
        1000
      )

    return () =>
      window.clearInterval(
        interval
      )
  }, [])

  /*
   * LOAD ORBITAL DATA
   *
   * This does NOT block Earth.
   * Earth is rendered immediately
   * with an empty object array.
   */

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        const data =
          await fetchOrbitalData()

        if (!active) {
          return
        }

        setOrbitalObjects(
          data
        )
      } catch (err) {
        console.error(
          'ORBITGUARD data loading error:',
          err
        )

        if (!active) {
          return
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load orbital data.'
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [])

  /*
   * SELECTED OBJECT
   */

  const selectedObject =
    useMemo(
      () =>
        orbitalObjects.find(
          (object) =>
            object.name ===
            selectedObjectName
        ) ?? null,
      [
        orbitalObjects,
        selectedObjectName,
      ]
    )

  /*
   * FILTERED OBJECTS
   */

  const filteredObjects =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase()

      if (!query) {
        return orbitalObjects
      }

      return orbitalObjects.filter(
        (object) =>
          object.name
            .toLowerCase()
            .includes(query) ||
          object.noradId
            .toLowerCase()
            .includes(query)
      )
    }, [
      orbitalObjects,
      searchQuery,
    ])

  /*
   * COUNTS
   */

  const satellites =
    orbitalObjects.filter(
      (object) =>
        object.type ===
        'Satellite'
    )

  const debris =
    orbitalObjects.filter(
      (object) =>
        object.type ===
        'Debris'
    )

  const otherObjects =
    orbitalObjects.filter(
      (object) =>
        object.type ===
          'Rocket Body' ||
        object.type ===
          'Unknown'
    )

  const highRiskObjects =
    orbitalObjects.filter(
      (object) =>
        object.risk ===
        'HIGH'
    )

  /*
   * SELECT OBJECT
   */

  const selectObject = (
    objectName: string
  ) => {
    setSelectedObjectName(
      objectName
    )
  }

  return (
    <div className="orbitguard-app">

      {/* HEADER */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-mark">
            ◉
          </div>

          <div>
            <div className="brand-name">
              ORBITGUARD
            </div>

            <div className="brand-subtitle">
              Orbital Intelligence Platform
            </div>
          </div>

        </div>

        <div className="topbar-right">

          <div className="live-status">

            <span
              className={`live-dot ${
                error
                  ? 'offline'
                  : ''
              }`}
            />

            {loading
              ? 'CONNECTING'
              : error
                ? 'OFFLINE'
                : 'LIVE'}

          </div>

          <div className="utc-time">
            UTC {utcTime}
          </div>

        </div>

      </header>

      {/* MAIN */}

      <main className="dashboard">

        {/* LEFT PANEL */}

        <aside className="left-panel">

          <div className="panel-section">

            <div className="section-title">
              OBJECT CONTROL
            </div>

            <div className="search-box">

              <span>
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search object or NORAD ID..."
                value={
                  searchQuery
                }
                onChange={(
                  event
                ) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
              />

            </div>

          </div>

          {/* COUNTS */}

          <div className="object-types">

            <div className="object-item active">

              <span className="object-icon">
                ●
              </span>

              <span>
                Satellites
              </span>

              <span className="object-count">
                {satellites.length}
              </span>

            </div>

            <div className="object-item">

              <span className="object-icon debris-icon">
                ◆
              </span>

              <span>
                Debris
              </span>

              <span className="object-count">
                {debris.length}
              </span>

            </div>

            <div className="object-item">

              <span className="object-icon">
                ◇
              </span>

              <span>
                Other
              </span>

              <span className="object-count">
                {otherObjects.length}
              </span>

            </div>

          </div>

          {/* TRACKED OBJECTS */}

          <div className="panel-section tracked-section">

            <div className="section-title">
              TRACKED OBJECTS
            </div>

            <div className="object-list">

              {loading &&
                orbitalObjects.length ===
                  0 && (
                  <div className="loading-card">

                    <div className="loading-spinner" />

                    <span>
                      Acquiring orbital catalog...
                    </span>

                  </div>
                )}

              {error && (
                <div className="empty-state error-state">
                  Data feed unavailable
                </div>
              )}

              {!loading &&
                !error &&
                filteredObjects.length ===
                  0 && (
                  <div className="empty-state">
                    No matching objects
                  </div>
                )}

              {filteredObjects
                .slice(0, 60)
                .map(
                  (object) => (
                    <button
                      key={
                        object.noradId
                      }
                      className={`object-select ${
                        selectedObjectName ===
                        object.name
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() =>
                        selectObject(
                          object.name
                        )
                      }
                    >

                      <span
                        className="object-select-dot"
                        style={{
                          background:
                            `#${object.color
                              .toString(
                                16
                              )
                              .padStart(
                                6,
                                '0'
                              )}`,
                        }}
                      />

                      <span className="object-select-name">
                        {object.name}
                      </span>

                      <span
                        className={`object-risk ${object.risk.toLowerCase()}`}
                      >
                        {object.risk}
                      </span>

                    </button>
                  )
                )}

            </div>

          </div>

          {/* SYSTEM STATUS */}

          <div className="system-status">

            <div className="section-title">
              SYSTEM STATUS
            </div>

            <div className="status-row">

              <span>
                Data Feed
              </span>

              <span
                className={
                  error
                    ? 'status-demo'
                    : loading
                      ? 'status-demo'
                      : 'status-online'
                }
              >
                {loading
                  ? 'SYNCING'
                  : error
                    ? 'OFFLINE'
                    : 'ONLINE'}
              </span>

            </div>

            <div className="status-row">

              <span>
                Tracking Engine
              </span>

              <span className="status-online">
                ACTIVE
              </span>

            </div>

            <div className="status-row">

              <span>
                Collision Engine
              </span>

              <span className="status-demo">
                DEMO
              </span>

            </div>

          </div>

        </aside>

        {/* CENTER */}

        <section className="center-area">

          <div className="globe-panel">

            <div className="globe-label">

              <div>
                <div className="globe-title">
                  ORBITAL VIEW
                </div>

                <div className="globe-subtitle">
                  Live orbital tracking environment
                </div>
              </div>

              <div className="viewport-status">
                <span className="live-dot" />
                LIVE VIEW
              </div>

            </div>

            {/* EARTH */}

            <div className="earth-wrapper">

              <Earth
                orbitalObjects={
                  filteredObjects
                }
                selectedObjectName={
                  selectedObjectName
                }
                onObjectSelect={(
                  object
                ) =>
                  setSelectedObjectName(
                    object.name
                  )
                }
              />

              {loading &&
                orbitalObjects.length ===
                  0 && (
                  <div className="earth-loading">

                    <div className="loading-ring" />

                    <span>
                      ACQUIRING ORBITAL FEED
                    </span>

                    <small>
                      Earth visualization online
                    </small>

                  </div>
                )}

            </div>

            <div className="globe-controls">

              <span>
                DRAG TO ROTATE
              </span>

              <span>
                SCROLL TO ZOOM
              </span>

              <span>
                CLICK OBJECT FOR DETAILS
              </span>

            </div>

          </div>

          {/* TELEMETRY */}

          <div className="telemetry-panel">

            <div className="telemetry-header">

              <div>

                <div className="section-title">
                  ORBITAL TELEMETRY
                </div>

                <div className="telemetry-subtitle">
                  Live tracking overview
                </div>

              </div>

              <div className="telemetry-live">
                <span className="live-dot" />
                STREAMING
              </div>

            </div>

            <div className="telemetry-grid">

              <div className="telemetry-card">

                <div className="telemetry-card-label">
                  TRACKED OBJECTS
                </div>

                <div className="telemetry-card-value">
                  {orbitalObjects.length
                    .toString()
                    .padStart(
                      2,
                      '0'
                    )}
                </div>

                <div className="telemetry-card-meta">
                  CelesTrak objects
                </div>

              </div>

              <div className="telemetry-card">

                <div className="telemetry-card-label">
                  ACTIVE ORBITS
                </div>

                <div className="telemetry-card-value">
                  {orbitalObjects.length
                    .toString()
                    .padStart(
                      2,
                      '0'
                    )}
                </div>

                <div className="telemetry-card-meta">
                  Propagated trajectories
                </div>

              </div>

              <div className="telemetry-card">

                <div className="telemetry-card-label">
                  HIGH RISK
                </div>

                <div className="telemetry-card-value warning">
                  {highRiskObjects.length
                    .toString()
                    .padStart(
                      2,
                      '0'
                    )}
                </div>

                <div className="telemetry-card-meta">
                  Temporary frontend indicator
                </div>

              </div>

              <div className="telemetry-card">

                <div className="telemetry-card-label">
                  DATA SOURCE
                </div>

                <div className="telemetry-card-value">
                  GP
                </div>

                <div className="telemetry-card-meta">
                  CelesTrak
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* RIGHT PANEL */}

        <aside className="right-panel">

          {selectedObject ? (
            <>

              <div className="right-panel-header">

                <div>

                  <div className="section-title">
                    OBJECT INTELLIGENCE
                  </div>

                  <div className="alert-summary">
                    Live propagated position
                  </div>

                </div>

                <div className="alert-indicator">
                  ●
                </div>

              </div>

              <div className="alert-card primary-card">

                <div className="alert-card-top">

                  <div className="alert-type">
                    {selectedObject.type}
                  </div>

                  <div className="alert-time">
                    LIVE
                  </div>

                </div>

                <div className="alert-object">
                  {selectedObject.name}
                </div>

                <div className="alert-description">
                  NORAD ID{' '}
                  {selectedObject.noradId}
                </div>

                <div className="alert-distance">

                  <span>
                    Altitude
                  </span>

                  <strong>
                    {selectedObject.altitude.toFixed(
                      1
                    )}{' '}
                    km
                  </strong>

                </div>

              </div>

              <div className="alert-card detail-card">

                <div className="alert-distance">
                  <span>
                    Latitude
                  </span>

                  <strong>
                    {selectedObject.latitude.toFixed(
                      2
                    )}°
                  </strong>
                </div>

                <div className="alert-distance">
                  <span>
                    Longitude
                  </span>

                  <strong>
                    {selectedObject.longitude.toFixed(
                      2
                    )}°
                  </strong>
                </div>

                <div className="alert-distance">
                  <span>
                    Inclination
                  </span>

                  <strong>
                    {selectedObject.inclination.toFixed(
                      2
                    )}°
                  </strong>
                </div>

                <div className="alert-distance">
                  <span>
                    Velocity
                  </span>

                  <strong>
                    {selectedObject.velocity.toFixed(
                      3
                    )}{' '}
                    km/s
                  </strong>
                </div>

                <div className="alert-distance">
                  <span>
                    Risk
                  </span>

                  <strong
                    className={`risk-text ${selectedObject.risk.toLowerCase()}`}
                  >
                    {selectedObject.risk}
                  </strong>
                </div>

              </div>

              <button
                className="clear-selection"
                onClick={() =>
                  setSelectedObjectName(
                    null
                  )
                }
              >
                CLEAR SELECTION
              </button>

            </>
          ) : (
            <>

              <div className="right-panel-header">

                <div>

                  <div className="section-title">
                    ALERT CENTER
                  </div>

                  <div className="alert-summary">
                    {highRiskObjects.length}{' '}
                    active risk indicators
                  </div>

                </div>

                <div className="alert-indicator">
                  !
                </div>

              </div>

              <div className="alert-card primary-card">

                <div className="alert-card-top">

                  <div className="alert-type">
                    DATA FEED
                  </div>

                  <div className="alert-time">
                    {loading
                      ? 'SYNC'
                      : 'LIVE'}
                  </div>

                </div>

                <div className="alert-object">
                  CelesTrak
                </div>

                <div className="alert-description">
                  Public orbital element data
                  propagated with SGP4.
                </div>

                <div className="alert-distance">

                  <span>
                    Objects loaded
                  </span>

                  <strong>
                    {orbitalObjects.length}
                  </strong>

                </div>

              </div>

              <div className="alert-info">

                <div className="info-icon">
                  i
                </div>

                <div>

                  <strong>
                    Tracking system online
                  </strong>

                  <p>
                    Earth visualization is
                    available while orbital
                    catalog data synchronizes.
                  </p>

                </div>

              </div>

            </>
          )}

        </aside>

      </main>

      {/* FOOTER */}

      <footer className="statusbar">

        <div className="stat">

          <span className="stat-value">
            {orbitalObjects.length
              .toString()
              .padStart(
                2,
                '0'
              )}
          </span>

          <span className="stat-label">
            OBJECTS
          </span>

        </div>

        <div className="stat">

          <span className="stat-value">
            {orbitalObjects.length
              .toString()
              .padStart(
                2,
                '0'
              )}
          </span>

          <span className="stat-label">
            ORBITS
          </span>

        </div>

        <div className="stat">

          <span className="stat-value">
            {highRiskObjects.length
              .toString()
              .padStart(
                2,
                '0'
              )}
          </span>

          <span className="stat-label">
            HIGH RISK
          </span>

        </div>

        <div className="stat">

          <span className="stat-value">
            --
          </span>

          <span className="stat-label">
            CONJUNCTION
          </span>

        </div>

        <div className="system-live">

          <span
            className={`live-dot ${
              error
                ? 'offline'
                : ''
            }`}
          />

          {error
            ? 'DATA FEED OFFLINE'
            : loading
              ? 'CONNECTING TO CATALOG'
              : 'SYSTEM OPERATIONAL'}

        </div>

      </footer>

    </div>
  )
}

export default App