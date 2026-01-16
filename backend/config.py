"""Configuration management using environment variables."""

import os
from pathlib import Path

# Base directory (backend folder)
BASE_DIR = Path(__file__).parent

# Data paths - can be overridden with environment variables
DATA_DIR = Path(os.getenv("DATA_DIR", BASE_DIR / "data"))
SHAPEFILE_DIR = Path(os.getenv("SHAPEFILE_DIR", DATA_DIR / "geojsons"))
CSV_FILE = Path(os.getenv("CSV_FILE", DATA_DIR / "nhgis.csv"))

# Shapefile pattern
SHAPEFILE_PATTERN = os.getenv("SHAPEFILE_PATTERN", "tl_2020_{fips}_bg20.shp")

# Convert Path objects to strings for compatibility with existing code
# Some libraries (like geopandas) expect string paths
SHAPEFILE_DIR_STR = str(SHAPEFILE_DIR)
CSV_FILE_STR = str(CSV_FILE)