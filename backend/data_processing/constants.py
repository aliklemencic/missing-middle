"""Constants for demographic data processing."""


def get_age_groups() -> dict[str, str]:
    """
    Returns a dictionary mapping CSV column age ranges to display age groups.
    
    Multiple CSV columns may map to the same display group (e.g., "15-17" and "18-19" 
    both map to "15 - 19"). This allows aggregating finer-grained data into broader categories.
    """
    return {
        "under_5": "00 - 04",
        "5-9": "05 - 09",
        "10-14": "10 - 14",
        "15-17": "15 - 19",
        "18-19": "15 - 19",
        "20": "20 - 24",
        "21": "20 - 24",
        "22-24": "20 - 24",
        "25-29": "25 - 29",
        "30-34": "30 - 34",
        "35-39": "35 - 39",
        "40-44": "40 - 44",
        "45-49": "45 - 49",
        "50-54": "50 - 54",
        "55-59": "55 - 59",
        "60-61": "60 - 64",
        "62-64": "60 - 64",
        "65-69": "65 - 69",
        "70-74": "70 - 74",
        "75-79": "75 - 79",
        "80-84": "80 - 84",
        "85_plus": "85+",
    }


def get_race_groups() -> list[str]:
    """
    Returns a list of race groups for the population pyramid.
    """
    return [
        "white",
        "black",
        "native",
        "asian",
        "islander",
        "other",
        "two_plus",
    ]
