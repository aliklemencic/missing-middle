"""GeoJSON and spatial data processing functions."""

import json

import geopandas as gpd
import pandas as pd


def construct_geoid(df: pd.DataFrame) -> pd.DataFrame:
    """
    Construct GEOID column from state, county, tract, and block group codes.

    Args:
        df: DataFrame with geographic identifiers

    Returns:
        DataFrame with GEOID column added
    """
    df = df.copy()
    # Construct GEOID: 2-digit state + 3-digit county + 6-digit tract + block group
    # zfill ensures proper zero-padding for FIPS codes
    df["GEOID"] = (
        df["STATEA"].astype(str).str.zfill(2)
        + df["COUNTYA"].astype(str).str.zfill(3)
        + df["TRACTA"].astype(str).str.zfill(6)
        + df["BLCK_GRPA"].astype(str)
    )
    return df


def load_shapefile(
    fips_code: str, shapefile_dir: str, shapefile_pattern: str
) -> gpd.GeoDataFrame:
    """
    Load shapefile for a given FIPS code.

    Args:
        fips_code: 5-digit FIPS code (state + county)
        shapefile_dir: Directory containing shapefiles
        shapefile_pattern: Pattern for shapefile names

    Returns:
        GeoDataFrame with shapefile data
    """
    shp_path = f"{shapefile_dir}/{shapefile_pattern.format(fips=fips_code)}"
    gdf = gpd.read_file(shp_path)

    # Create GEOID column if it doesn't exist
    if "GEOID" not in gdf.columns:
        gdf["GEOID"] = (
            gdf["STATEFP20"] + gdf["COUNTYFP20"] + gdf["TRACTCE20"] + gdf["BLKGRPCE20"]
        )

    return gdf


def calculate_housing_changes(
    gdf: gpd.GeoDataFrame, year1: str, year2: str, city: str
) -> gpd.GeoDataFrame:
    """
    Calculate housing unit changes and add to GeoDataFrame.

    Args:
        gdf: GeoDataFrame with housing data
        year1: First year for comparison
        year2: Second year for comparison
        city: City to highlight with z-values

    Returns:
        GeoDataFrame with housing change columns added
    """
    gdf = gdf.copy()

    # Calculate changes
    gdf["housing_units_change"] = round(
        gdf[f"housing_units_{year2}"] - gdf[f"housing_units_{year1}"]
    )
    gdf["housing_units_change_percent"] = gdf.apply(
        lambda row: round(
            (
                (row[f"housing_units_{year2}"] - row[f"housing_units_{year1}"])
                / row[f"housing_units_{year1}"]
                * 100
            ),
            2,
        )
        if pd.notna(row[f"housing_units_{year1}"])
        and row[f"housing_units_{year1}"] != 0
        else None,
        axis=1,
    )

    # Only fill z-values for the specified city (for map visualization)
    # Other cities remain None/transparent on the map
    gdf["z"] = gdf.apply(
        lambda row: row["housing_units_change"] if row["TOWN"] == city else None,
        axis=1,
    )

    return gdf


def merge_geojson(
    df: pd.DataFrame,
    year1: str,
    year2: str,
    city: str,
    shapefile_dir: str,
    shapefile_pattern: str,
) -> dict:
    """
    Merges the GeoJSON block group data with the population/housing data for a specific city.

    Args:
        df: DataFrame with demographic and housing data
        year1: First year for comparison
        year2: Second year for comparison
        city: City name to analyze
        shapefile_dir: Directory containing shapefiles
        shapefile_pattern: Pattern for shapefile names

    Returns:
        GeoJSON dictionary
    """
    # Construct GEOID in df
    df = construct_geoid(df)

    # Get unique state/county combinations
    unique_combos = df[["STATEA", "COUNTYA"]].drop_duplicates()

    all_gdfs = []
    for state_code, county_code in unique_combos.itertuples(index=False, name=None):
        # Construct 5-digit FIPS code (state + county)
        fips = f"{str(state_code).zfill(2)}{str(county_code).zfill(3)}"

        # Load shapefile for this county
        gdf = load_shapefile(fips, shapefile_dir, shapefile_pattern)

        # Merge housing data into GeoDataFrame using GEOID as the key
        # left join preserves all block groups even if they lack housing data
        gdf = gdf.merge(df, left_on="GEOID20", right_on="GEOID", how="left")

        # Calculate housing changes
        gdf = calculate_housing_changes(gdf, year1, year2, city)

        all_gdfs.append(gdf)

    # Combine into a single GeoDataFrame
    combined_gdf = pd.concat(all_gdfs, ignore_index=True)

    # Convert to GeoJSON
    geojson = json.loads(combined_gdf.to_json())

    return geojson
