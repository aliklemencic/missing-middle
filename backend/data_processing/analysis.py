"""Analysis functions for demographic change calculations."""

from typing import Any

import pandas as pd

from .aggregation import get_age_group_counts, get_race_group_counts
from .insights import create_demographic_sentences


def calculate_age_group_changes(
    age_group_year1: dict, age_group_year2: dict
) -> dict[str, dict[str, Any]]:
    """
    Calculate changes in age group data between two years.

    Args:
        age_group_year1: Age group counts for first year
        age_group_year2: Age group counts for second year

    Returns:
        Dictionary with absolute and percent changes by gender
    """
    age_group_change_data = {}
    for age_group, year1_count in age_group_year1.items():
        # Male changes
        male_change_absolute = age_group_year2[age_group]["male"] - year1_count["male"]
        # Calculate percent change, handling division by zero
        male_change_percent = (
            male_change_absolute / year1_count["male"] * 100
            if year1_count["male"] != 0
            else 100 if male_change_absolute > 0 else 0
        )

        # Female changes
        female_change_absolute = (
            age_group_year2[age_group]["female"] - year1_count["female"]
        )
        female_change_percent = (
            female_change_absolute / year1_count["female"] * 100
            if year1_count["female"] != 0
            else 100 if female_change_absolute > 0 else 0
        )

        # Total changes
        total_change_absolute = (
            age_group_year2[age_group]["total"] - year1_count["total"]
        )
        total_change_percent = (
            total_change_absolute / year1_count["total"] * 100
            if year1_count["total"] != 0
            else 100 if total_change_absolute > 0 else 0
        )

        age_group_change_data[age_group] = {
            "male_change_absolute": male_change_absolute,
            "male_change_percent": male_change_percent,
            # Color coding: red for decreases, blue/coral/green for increases
            "male_color": "darkred" if male_change_absolute < 0 else "steelblue",
            "female_change_absolute": female_change_absolute,
            "female_change_percent": female_change_percent,
            "female_color": "darkred" if female_change_absolute < 0 else "lightcoral",
            "total_change_absolute": total_change_absolute,
            "total_change_percent": total_change_percent,
            "total_color": "darkred" if total_change_absolute < 0 else "#30664B",
        }

    return age_group_change_data


def calculate_race_group_changes(
    race_group_year1: dict, race_group_year2: dict
) -> dict[str, dict[str, Any]]:
    """
    Calculate changes in race group data between two years.

    Args:
        race_group_year1: Race group counts for first year
        race_group_year2: Race group counts for second year

    Returns:
        Dictionary with absolute and percent changes by racial group
    """
    race_group_change_data = {}
    for race_group, year1_count in race_group_year1.items():
        race_group_change_absolute = race_group_year2[race_group] - year1_count
        race_group_change_percent = (
            race_group_change_absolute / year1_count * 100
            if year1_count != 0
            else race_group_year2[race_group]
        )
        race_group_change_data[race_group] = {
            "change_absolute": race_group_change_absolute,
            "change_percent": race_group_change_percent,
            "color": "darkred" if race_group_change_absolute < 0 else "#30664B",
        }

    return race_group_change_data


def get_top_age_group_changes(
    age_group_change_data: dict[str, dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    """
    Find the age group with the biggest increase and decrease for the year.

    Args:
        age_group_change_data: Dictionary of age group changes

    Returns:
        Dictionary with top increase and decrease
    """
    # Flatten all age group changes into a single list to allow finding
    # the single largest increase/decrease across all categories
    all_changes = [
        {
            "group": f"{category} population aged {age_group}",
            "change": data[f"{category}_change_absolute"],
            "percent": data[f"{category}_change_percent"],
            "color": data[f"{category}_color"],
            "male": data["male_change_absolute"],
            "female": data["female_change_absolute"],
            "total": data["total_change_absolute"],
        }
        for age_group, data in age_group_change_data.items()
        for category in ["male", "female", "total"]
    ]

    return {
        "increase": max(all_changes, key=lambda x: x["change"]),
        "decrease": min(all_changes, key=lambda x: x["change"]),
    }


def get_top_race_group_changes(
    race_group_change_data: dict[str, dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    """
    Find the racial group with the biggest increase and decrease for the year.

    Args:
        race_group_change_data: Dictionary of race group changes

    Returns:
        Dictionary with top increase and decrease
    """
    largest_increase = max(
        race_group_change_data.items(), key=lambda x: x[1]["change_absolute"]
    )
    largest_decrease = min(
        race_group_change_data.items(), key=lambda x: x[1]["change_absolute"]
    )

    return {
        "increase": {
            "group": largest_increase[0],
            "change": largest_increase[1]["change_absolute"],
            "percent": largest_increase[1]["change_percent"],
            "color": largest_increase[1]["color"],
        },
        "decrease": {
            "group": largest_decrease[0],
            "change": largest_decrease[1]["change_absolute"],
            "percent": largest_decrease[1]["change_percent"],
            "color": largest_decrease[1]["color"],
        },
    }


def get_total_city_change(
    age_group_change_data: dict[str, dict[str, Any]],
    age_group_year1_data: dict[str, dict[str, Any]],
) -> dict[str, Any]:
    """
    Returns the total change in the city population for the given years.

    Args:
        age_group_change_data: Dictionary of age group changes
        age_group_year1_data: Dictionary of year 1 age group data

    Returns:
        Dictionary with total change statistics
    """
    total_change = 0
    year1_total = 0
    for age_group, data in age_group_change_data.items():
        total_change += data["total_change_absolute"]
        year1_total += age_group_year1_data[age_group]["total"]

    city_change = {
        "change": total_change,
        "percent": total_change / year1_total * 100,
        "color": "darkred" if total_change < 0 else "#30664B",
    }

    return city_change


def get_population_data(
    df: pd.DataFrame, year1: str, year2: str, city: str
) -> dict[str, Any]:
    """
    Returns JSON of population pyramid data, aggregating all population data and analysis.

    Args:
        df: DataFrame containing demographic data
        year1: First year for comparison
        year2: Second year for comparison
        city: City name to analyze

    Returns:
        Dictionary containing age and race group data with changes
    """
    # Get counts
    age_group_year1 = get_age_group_counts(df, year1, city)
    race_group_year1 = get_race_group_counts(df, year1, city)
    age_group_year2 = get_age_group_counts(df, year2, city)
    race_group_year2 = get_race_group_counts(df, year2, city)

    # Calculate changes
    age_group_change_data = calculate_age_group_changes(
        age_group_year1, age_group_year2
    )
    race_group_change_data = calculate_race_group_changes(
        race_group_year1, race_group_year2
    )

    # Get top changes
    top_age_group_changes = get_top_age_group_changes(age_group_change_data)
    top_race_group_changes = get_top_race_group_changes(race_group_change_data)

    # Create sentences
    top_age_group_change_sentences = create_demographic_sentences(top_age_group_changes)
    top_race_group_change_sentences = create_demographic_sentences(
        top_race_group_changes
    )

    total_city_change = get_total_city_change(age_group_change_data, age_group_year1)

    return {
        "age_group_data": {
            "year1": age_group_year1,
            "year2": age_group_year2,
            "changes": age_group_change_data,
            "sentences": top_age_group_change_sentences,
        },
        "race_group_data": {
            "year1": race_group_year1,
            "year2": race_group_year2,
            "changes": race_group_change_data,
            "sentences": top_race_group_change_sentences,
        },
        "total_city_change": total_city_change,
    }
