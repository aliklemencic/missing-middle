"""Data processing package for demographic analysis."""

from .aggregation import get_city_housing_data
from .analysis import get_population_data
from .geospatial import merge_geojson
from .insights import create_housing_demographic_sentences

__all__ = [
    "get_city_housing_data",
    "get_population_data",
    "merge_geojson",
    "create_housing_demographic_sentences",
]
