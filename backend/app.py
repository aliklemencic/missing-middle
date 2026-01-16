import logging

import pandas as pd
from config import CSV_FILE_STR, SHAPEFILE_DIR_STR, SHAPEFILE_PATTERN
from data_processing import (
    create_housing_demographic_sentences,
    get_city_housing_data,
    get_population_data,
    merge_geojson,
)
from flask import Flask, Response, jsonify, request
from validation import RequestValidator, ValidationError

app = Flask(__name__)

# Load data once at startup (not per-request for performance)
df = pd.read_csv(CSV_FILE_STR)

# Initialize validator with available years
# Valid years are hardcoded but could be derived from CSV columns
VALID_YEARS = ["1990", "2000", "2010", "2020"]
validator = RequestValidator(df, VALID_YEARS)

# Initialize logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.route("/api/population", methods=["POST"])
def population_data() -> Response:
    """
    Returns JSON of population data for the given years and city by age and race.
    """
    request_data = request.get_json()
    if not request_data:
        return jsonify({"error": "Request body must be JSON"}), 400

    year1 = request_data.get("year1")
    year2 = request_data.get("year2")
    city = request_data.get("city")

    try:
        # Validate all parameters
        validator.validate_request(year1, year2, city)

        # Process request
        data = get_population_data(df, year1, year2, city)
        return jsonify(data), 200

    except ValidationError as e:
        logger.warning(f"Validation error in population_data: {str(e)}")
        return jsonify({"error": str(e)}), 400
    except KeyError as e:
        logger.error(f"Data column not found: {str(e)}")
        return jsonify({"error": f"Data column not found: {str(e)}"}), 500
    except Exception as e:
        logger.error(f"Unexpected error in population_data: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route("/api/housing", methods=["POST"])
def housing_data() -> Response:
    """
    Returns JSON of tracts data for the given years.
    Includes all cities for drawing the map.
    """
    request_data = request.get_json()
    if not request_data:
        return jsonify({"error": "Request body must be JSON"}), 400

    year1 = request_data.get("year1")
    year2 = request_data.get("year2")
    city = request_data.get("city")
    city_change_absolute = request_data.get("city_change_absolute")
    city_change_percent = request_data.get("city_change_percent")

    try:
        # Validate all parameters
        validator.validate_request(year1, year2, city)

        # Process request
        geojson_data = merge_geojson(
            df, year1, year2, city, SHAPEFILE_DIR_STR, SHAPEFILE_PATTERN
        )

        sentences = []
        # Only generate insights if population change data is provided
        # This allows the endpoint to work without insights if needed
        if city_change_absolute:
            city_change_dict = {
                "change": int(city_change_absolute),
                "percent": float(city_change_percent),
            }
            city_housing_data = get_city_housing_data(df, year1, year2, city)
            sentences = create_housing_demographic_sentences(
                city, city_housing_data, city_change_dict
            )

        response_data = {"geojson": geojson_data, "sentences": sentences}
        return jsonify(response_data), 200

    except ValidationError as e:
        logger.warning(f"Validation error in housing_data: {str(e)}")
        return jsonify({"error": str(e)}), 400
    except FileNotFoundError as e:
        logger.error(f"Required file not found: {str(e)}")
        return jsonify({"error": f"Required file not found: {str(e)}"}), 500
    except KeyError as e:
        logger.error(f"Data column not found: {str(e)}")
        return jsonify({"error": f"Data column not found: {str(e)}"}), 500
    except Exception as e:
        logger.error(f"Unexpected error in housing_data: {e}")
        return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    app.run()
