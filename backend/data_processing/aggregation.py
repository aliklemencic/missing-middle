"""Data aggregation functions for demographic analysis."""

import pandas as pd

from .constants import get_age_groups, get_race_groups


def get_age_group_counts(
    df: pd.DataFrame, year: str, city: str
) -> dict[str, dict[str, int]]:
    """
    Returns age group counts for the given year and city.
    Includes male and female counts and totals.

    Args:
        df: DataFrame containing demographic data
        year: Year to aggregate data for
        city: City name to filter by

    Returns:
        Dictionary mapping age groups to gender counts and totals
    """
    age_groups = get_age_groups()
    df = df[df["TOWN"] == city]

    age_group_counts = {}
    for csv_age, plot_age in age_groups.items():
        age_group_data = age_group_counts.get(plot_age, {})
        for prefix in ["male", "female"]:
            col_name = f"{prefix}_{csv_age}_{year}"
            col_count = int(df[col_name].sum())
            age_group_data[prefix] = age_group_data.get(prefix, 0) + col_count
            age_group_data["total"] = age_group_data.get("total", 0) + col_count
        age_group_counts[plot_age] = age_group_data

    return age_group_counts


def get_race_group_counts(df: pd.DataFrame, year: str, city: str) -> dict[str, int]:
    """
    Returns race group counts for the given year and city.

    Args:
        df: DataFrame containing demographic data
        year: Year to aggregate data for
        city: City name to filter by

    Returns:
        Dictionary mapping race groups to counts
    """
    race_groups = get_race_groups()
    df = df[df["TOWN"] == city]

    counts = {}
    for race in race_groups:
        col_name = f"pop_{race}_{year}"
        race_label = "multiracial" if race == "two_plus" else race
        race_group_count = counts.get(race_label, 0) + int(df[col_name].sum())
        counts[race_label] = race_group_count

    return counts


def get_city_housing_data(df: pd.DataFrame, year1: str, year2: str, city: str) -> dict:
    """
    Calculate city-wide housing statistics in absolute and percent.

    Args:
        df: DataFrame containing housing data
        year1: First year for comparison
        year2: Second year for comparison
        city: City name to analyze

    Returns:
        Dictionary with housing unit counts and changes.
    """
    city_df = df[df["TOWN"] == city]
    total_units_year1 = int(city_df[f"housing_units_{year1}"].sum())
    total_units_year2 = int(city_df[f"housing_units_{year2}"].sum())
    total_change_absolute = total_units_year2 - total_units_year1
    total_change_percent = (
        round((total_change_absolute / total_units_year1 * 100), 2)
        if total_units_year1 != 0
        else 0
    )

    return {
        "year1": total_units_year1,
        "year2": total_units_year2,
        "change_absolute": total_change_absolute,
        "change_percent": total_change_percent,
    }
