"""Request validation for API endpoints."""

from typing import Optional

import pandas as pd


class ValidationError(Exception):
    """Custom exception for validation errors."""

    pass


class RequestValidator:
    """Validates API request parameters against dataset."""

    def __init__(self, df: pd.DataFrame, valid_years: list[str]):
        """
        Initialize validator with dataset.

        Args:
            df: DataFrame containing the demographic data
            valid_years: List of valid years in the dataset
        """
        self.df = df
        self.valid_years = valid_years
        # Filter out NaN values before sorting
        self.valid_cities = sorted(self.df["TOWN"].dropna().unique().tolist())

    def validate_year(self, year: str, param_name: str = "year") -> None:
        """
        Validate that a year is valid.

        Args:
            year: Year to validate
            param_name: Name of the parameter (for error messages)

        Raises:
            ValidationError: If year is invalid
        """
        if not year:
            raise ValidationError(f"{param_name} is required")

        if year not in self.valid_years:
            raise ValidationError(
                f"Invalid {param_name}: '{year}'. Must be one of {self.valid_years}"
            )

        # Check if data exists for this year
        year_columns = [col for col in self.df.columns if col.endswith(f"_{year}")]
        if not year_columns:
            raise ValidationError(f"No data available for {param_name}: {year}")

    def validate_city(self, city: str) -> None:
        """
        Validate that a city exists in the dataset.

        Args:
            city: City name to validate

        Raises:
            ValidationError: If city is invalid
        """
        if not city:
            raise ValidationError("city is required")

        if city not in self.valid_cities:
            raise ValidationError(f"Invalid city: '{city}'. City not found in dataset")

        # Verify there's actual data for this city
        city_data = self.df[self.df["TOWN"] == city]
        if city_data.empty:
            raise ValidationError(f"No data found for city: {city}")

    def validate_request(
        self, year1: Optional[str], year2: Optional[str], city: Optional[str]
    ) -> None:
        """
        Validate all request parameters.

        Args:
            year1: First year parameter
            year2: Second year parameter
            city: City parameter

        Raises:
            ValidationError: If any parameter is invalid
        """
        self.validate_year(year1, "year1")
        self.validate_year(year2, "year2")
        self.validate_city(city)

        # Additional validation: ensure years are in logical order
        if int(year1) >= int(year2):
            raise ValidationError(f"year1 ({year1}) must be before year2 ({year2})")
