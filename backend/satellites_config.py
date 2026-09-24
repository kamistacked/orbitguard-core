# OrbitGuard Tracked Satellites & Space Assets Catalog Configuration
# Catalog covers LEO (400-1200km), MEO (Navigation ~20,000km), and GEO (Communications ~35,786km)

TRACKED_OBJECTS = [
    # --- Space Stations & Science Satellites (LEO) ---
    {"norad_id": 25544, "type": "PAYLOAD", "name": "ISS (ZARYA)"},
    {"norad_id": 48274, "type": "PAYLOAD", "name": "TIANGONG SPACE STATION"},
    {"norad_id": 20580, "type": "PAYLOAD", "name": "HUBBLE SPACE TELESCOPE"},
    {"norad_id": 25994, "type": "PAYLOAD", "name": "TERRA (EOS AM-1)"},
    {"norad_id": 27424, "type": "PAYLOAD", "name": "AQUA (EOS PM-1)"},
    {"norad_id": 25338, "type": "PAYLOAD", "name": "NOAA 15 (WEATHER)"},
    {"norad_id": 28654, "type": "PAYLOAD", "name": "NOAA 18 (WEATHER)"},
    {"norad_id": 33591, "type": "PAYLOAD", "name": "NOAA 19 (WEATHER)"},
    {"norad_id": 43013, "type": "PAYLOAD", "name": "NOAA 20 (JPSS-1)"},

    # --- Megaconstellations & Communications (LEO) ---
    {"norad_id": 44713, "type": "STARLINK", "name": "STARLINK-1007"},
    {"norad_id": 44714, "type": "STARLINK", "name": "STARLINK-1008"},
    {"norad_id": 44715, "type": "STARLINK", "name": "STARLINK-1009"},
    {"norad_id": 44716, "type": "STARLINK", "name": "STARLINK-1010"},
    {"norad_id": 44717, "type": "STARLINK", "name": "STARLINK-1111"},
    {"norad_id": 45131, "type": "PAYLOAD", "name": "ONEWEB-0100"},
    {"norad_id": 42955, "type": "PAYLOAD", "name": "IRIDIUM 100"},

    # --- Global Navigation Constellations (MEO ~20,000 km) ---
    {"norad_id": 29601, "type": "PAYLOAD", "name": "GPS BIIRM-3 (PRN 12)"},
    {"norad_id": 37753, "type": "PAYLOAD", "name": "GPS IIF-2 (PRN 01)"},
    {"norad_id": 43873, "type": "PAYLOAD", "name": "GPS III-01 (PRN 04)"},
    {"norad_id": 43564, "type": "PAYLOAD", "name": "GALILEO 26 (GSAT0219)"},
    {"norad_id": 43565, "type": "PAYLOAD", "name": "GALILEO 27 (GSAT0220)"},
    {"norad_id": 36111, "type": "PAYLOAD", "name": "GLONASS-M (730)"},
    {"norad_id": 40305, "type": "PAYLOAD", "name": "GLONASS-K (702)"},

    # --- Geostationary Earth Orbit Assets (GEO ~35,786 km) ---
    {"norad_id": 41866, "type": "PAYLOAD", "name": "GOES 16 (WEATHER GEO)"},
    {"norad_id": 43226, "type": "PAYLOAD", "name": "GOES 17 (WEATHER GEO)"},
    {"norad_id": 39504, "type": "PAYLOAD", "name": "TDRS 12 (RELAY GEO)"},
    {"norad_id": 28628, "type": "PAYLOAD", "name": "INMARSAT 4-F1 (GEO)"},
    {"norad_id": 36585, "type": "PAYLOAD", "name": "SES-1 (COMMS GEO)"},
    {"norad_id": 44337, "type": "PAYLOAD", "name": "EUTELSAT 7C (GEO)"},

    # --- Tracked Debris Clouds & Spent Rocket Bodies (High Risk) ---
    {"norad_id": 30118, "type": "DEBRIS", "name": "FENGYUN 1C DEBRIS (30118)"},
    {"norad_id": 33749, "type": "DEBRIS", "name": "FENGYUN 1C DEBRIS (33749)"},
    {"norad_id": 34111, "type": "DEBRIS", "name": "COSMOS 2251 DEBRIS (34111)"},
    {"norad_id": 34454, "type": "DEBRIS", "name": "COSMOS 2251 DEBRIS (34454)"},
    {"norad_id": 49863, "type": "DEBRIS", "name": "KOSMOS 1408 DEBRIS (49863)"},
    {"norad_id": 33853, "type": "DEBRIS", "name": "IRIDIUM 33 DEBRIS (33853)"},
    {"norad_id": 54236, "type": "ROCKET_BODY", "name": "CZ-6A ROCKET BODY"},
    {"norad_id": 43237, "type": "DEBRIS", "name": "CZ-4C R/B DEBRIS"},
    {"norad_id": 22285, "type": "ROCKET_BODY", "name": "SL-16 ROCKET BODY"}
]