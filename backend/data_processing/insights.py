"""Text generation functions for natural language insights."""

from typing import Any


def create_demographic_sentences(top_changes: dict[str, dict[str, Any]]) -> list[str]:
    """
    Creates sentences from the top increases and decreases by age or racial group.

    Args:
        top_changes: Dictionary with 'increase' and 'decrease' keys

    Returns:
        List of formatted sentences
    """
    sentences = []

    for direction, change_data in top_changes.items():
        sentence = (
            f"The {change_data['group']} population {direction}d by "
            f"{abs(round(change_data['change'], 2))} people "
            f"({abs(round(change_data['percent'], 2))}%)."
        )

        # Add gender breakdown if available
        if change_data["group"].split(" ")[0] == "total":
            sentence += (
                f" {abs(round(change_data['male'], 2))} were men and "
                f"{abs(round(change_data['female'], 2))} were women."
            )

        sentences.append(sentence)

    return sentences


def create_housing_demographic_sentences(
    city: str, city_housing_data: dict, city_change_dict: dict
) -> list[str]:
    """
    Creates insight sentences connecting housing and demographic changes.

    Args:
        city: City name
        city_housing_data: Dictionary with housing unit statistics
        city_change_dict: Dictionary with population change statistics

    Returns:
        List of insight sentences
    """
    sentences = []

    housing_change = city_housing_data["change_absolute"]
    housing_percent = city_housing_data["change_percent"]
    pop_change = city_change_dict["change"]
    pop_percent = city_change_dict["percent"]

    # Housing growth with population growth
    if housing_change > 0 and pop_change > 0:
        ratio = abs(pop_change) / housing_change if housing_change != 0 else 0
        sentences.append(
            f"Housing units increased by {abs(housing_change):,} ({abs(housing_percent):.1f}%) "
            f"across {city}, while the population grew by {abs(int(pop_change)):,} people "
            f"({abs(pop_percent):.1f}%). This suggests approximately {ratio:.1f} people per new housing unit."
        )

    # Housing growth with population decline
    elif housing_change > 0 and pop_change < 0:
        sentences.append(
            f"Despite housing units increasing by {abs(housing_change):,} ({abs(housing_percent):.1f}%) "
            f"across {city}, the population declined by {abs(int(pop_change)):,} people "
            f"({abs(pop_percent):.1f}%), indicating households are shrinking in size or vacancy rates are rising."
        )

    # Housing decline
    elif housing_change < 0:
        sentences.append(
            f"Housing units decreased by {abs(housing_change):,} ({abs(housing_percent):.1f}%) across {city}, "
            f"while the population changed by {int(pop_change):+,} people ({abs(pop_percent):.1f}%)."
        )

    # Housing stable
    else:
        sentences.append(
            f"Housing units remained relatively stable with a change of {housing_change:+,} across {city}, "
            f"while the population changed by {int(pop_change):+,} people ({abs(pop_percent):.1f}%)."
        )

    return sentences
