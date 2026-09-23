# Add as many satellites, space stations, or debris fragments as you want here.
# Find any NORAD ID on celestrak.org or n2yo.com.

TRACKED_OBJECTS = [
    # --- Space Stations & Science Satellites ---
    {"norad_id": 25544, "type": "PAYLOAD", "name": "ISS (ZARYA)"},
    {"norad_id": 20580, "type": "PAYLOAD", "name": "HUBBLE SPACE TELESCOPE"},
    {"norad_id": 48274, "type": "PAYLOAD", "name": "TIANGONG SPACE STATION"},
    {"norad_id": 25338, "type": "PAYLOAD", "name": "NOAA 15 (WEATHER)"},
    {"norad_id": 28654, "type": "PAYLOAD", "name": "NOAA 18 (WEATHER)"},

    # --- Starlink Constellation ---
    {"norad_id": 44713, "type": "STARLINK", "name": "STARLINK-1007"},
    {"norad_id": 44714, "type": "STARLINK", "name": "STARLINK-1008"},
    {"norad_id": 44715, "type": "STARLINK", "name": "STARLINK-1009"},

    # --- Tracked Debris Clouds & Spent Rockets ---
    {"norad_id": 33749, "type": "DEBRIS", "name": "FENGYUN 1C DEBRIS"},
    {"norad_id": 34454, "type": "DEBRIS", "name": "COSMOS 2251 DEBRIS"},
    {"norad_id": 43237, "type": "DEBRIS", "name": "CZ-4C R/B DEBRIS"},
    {"norad_id": 24947, "type": "DEBRIS", "name": "IRIDIUM 33 DEBRIS"}
]