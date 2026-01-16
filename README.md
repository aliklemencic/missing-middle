# The Missing Middle: Visualizing Population Gaps for Smarter Urban Planning

A full-stack web application that visualizes demographic shifts and housing changes in Massachusetts communities over time. The application helps urban planners, researchers, and policymakers understand population trends by age and race, and compare these with additional data across different cities and time periods. Additional data is limited to housing supply at the moment, but could be expanded to transportation and food access.

## Features

### Population Analysis
- **Age Group Analysis**: Interactive population pyramid showing demographic changes by age group (0-4 through 85+)
- **Race/Ethnicity Analysis**: Interactive population pyramid showing demographic changes by racial group
- **Demographic Insights**: Automated analysis detailing largest increase and decrease in population(s)
- **Detailed Breakdown**: Detailed racial data or male/female population changes within each age group for each time period
- **Time Period Comparison**: Compare demographic data between any two census years (1990, 2000, 2010, 2020)

### 🏘️ Housing Supply Visualization
- **Interactive Choropleth Maps**: Geographic visualization of housing unit changes at the block group level
- **Housing-Demographic Insights**: Automated analysis connecting housing supply changes with population shifts
- **City-Specific Analysis**: Focus on individual cities while maintaining regional context

### 🎯 Key Capabilities
- **Multi-City Support**: Analyze data for ~100 Massachusetts cities
- **Dynamic Visualizations**: Responsive charts and maps that adapt to data ranges
- **Insight Generation**: Automated natural language insights highlighting key demographic trends
- **Interactive Exploration**: Click on chart elements to see detailed breakdowns

## Tech Stack

### Backend
- **Python 3.13+**
- **Flask**: RESTful API server
- **Pandas**: Data processing and analysis
- **GeoPandas**: Spatial data processing and GeoJSON generation

### Frontend
- **React 19**: UI framework
- **Vite**: Build tool and dev server
- **React Plotly.js**: Interactive charts and maps

## Project Structure

```
missing-middle/
├── backend/                                  # Flask API server
│   ├── app.py                                # Main Flask application and API routes
│   ├── config.py                             # Configuration management (paths, env vars)
│   ├── validation.py                         # Request validation and error handling
│   ├── requirements.txt                      # Python dependencies
│   ├── data/                                 # Data files
│   │   ├── nhgis.csv                         # Demographic and housing data
│   │   └── geojsons/                         # Census block group shapefiles
│   └── data_processing/                      # Data processing modules
│       ├── __init__.py
│       ├── aggregation.py                    # Data aggregation functions
│       ├── analysis.py                       # Change calculations and comparisons
│       ├── constants.py                      # Age groups, race groups constants
│       ├── geospatial.py                     # GeoJSON handling and spatial operations
│       └── insights.py                       # Natural language insight generation
│
└── frontend/
    └── missing-middle/                       # React application
        ├── src/
        │   ├── App.jsx                       # Main application component
        │   ├── App.css                       # Global styles
        │   ├── components/                   # React components
        │   │   ├── ControlPanel.jsx          # Year/city selection controls
        │   │   ├── PopulationPyramid.jsx     # Main population view container
        │   │   ├── AgePopulationPyramid.jsx  # Age-based visualizations
        │   │   ├── RacePopulationPyramid.jsx # Race-based visualizations
        │   │   ├── HousingMap.jsx            # Housing supply map
        │   │   └── GroupDetails.jsx          # Detailed breakdown panel
        │   └── utils/
        │       └── api.js                    # API client functions
        ├── package.json
        └── vite.config.js
```

## Prerequisites

- **Python 3.13+** (or Python 3.10+)
- **Node.js 18+** and npm
- **Virtual environment** (recommended for Python)

## Installation

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Verify data files exist:**
   - `data/nhgis.csv` - Main demographic dataset
   - `data/geojsons/` - Census block group shapefiles

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend/missing-middle
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Configuration

### Backend Configuration

The backend uses environment variables for configuration. Default paths are relative to the `backend/` directory:

- `DATA_DIR`: Base data directory (default: `data`)
- `CSV_FILE`: Path to CSV file (default: `data/nhgis.csv`)
- `SHAPEFILE_DIR`: Directory containing shapefiles (default: `data/geojsons`)
- `SHAPEFILE_PATTERN`: Pattern for shapefile names (default: `tl_2020_{fips}_bg20.shp`)

You can override these by setting environment variables:
```bash
export DATA_DIR=/path/to/data
export CSV_FILE=/path/to/data/nhgis.csv
```

### Frontend Configuration

The frontend API client is configured in `src/utils/api.js`. By default, it assumes the backend is running on the same host. To configure a different backend URL, modify the fetch URLs in `api.js`.

## Running the Application

### Development Mode

1. **Start the backend server:**
   ```bash
   cd backend
   source venv/bin/activate  # If not already activated
   flask run
   # Or: python app.py
   ```
   The API will be available at `http://localhost:5000`

2. **Start the frontend dev server:**
   ```bash
   cd frontend/missing-middle
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` (or another port if 5173 is busy)

3. **Access the application:**
   Open your browser to the frontend URL (typically `http://localhost:5173`)

### Production Build

1. **Build the frontend:**
   ```bash
   cd frontend/missing-middle
   npm run build
   ```

2. **Serve the built files:**
   The `dist/` folder contains the production build. Serve it with any static file server or configure Flask to serve it.

## API Documentation

### Endpoints

#### `POST /api/population`

Returns population data for a given city and time period.

**Request Body:**
```json
{
  "year1": "2010",
  "year2": "2020",
  "city": "Somerville"
}
```

**Response:**
```json
{
  "age_group_data": {
    "year1": { /* age group counts for year1 */ },
    "year2": { /* age group counts for year2 */ },
    "changes": { /* calculated changes */ },
    "sentences": [ /* insight sentences */ ]
  },
  "race_group_data": {
    "year1": { /* race group counts for year1 */ },
    "year2": { /* race group counts for year2 */ },
    "changes": { /* calculated changes */ },
    "sentences": [ /* insight sentences */ ]
  },
  "total_city_change": {
    "change": 1234,
    "percent": 5.2,
    "color": "#30664B"
  }
}
```

#### `POST /api/housing`

Returns housing supply data and GeoJSON for map visualization.

**Request Body:**
```json
{
  "year1": "2010",
  "year2": "2020",
  "city": "Somerville",
  "city_change_absolute": 1234,
  "city_change_percent": 5.2
}
```

**Response:**
```json
{
  "geojson": { /* GeoJSON FeatureCollection */ },
  "sentences": [ /* housing-demographic insights */ ]
}
```

### Error Responses

All endpoints return standard HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation error)
- `500`: Internal Server Error

Error responses include a JSON body with an `error` field:
```json
{
  "error": "Invalid city: 'InvalidCity'. City not found in dataset"
}
```

## Data Format

### CSV Data Structure

The `nhgis.csv` file should contain:
- Geographic identifiers: `STATEA`, `COUNTYA`, `TRACTA`, `BLCK_GRPA`, `TOWN`
- Population columns: `male_{age}_{year}`, `female_{age}_{year}`, `pop_{race}_{year}`
- Housing columns: `housing_units_{year}`

### Shapefile Format

Shapefiles should follow the Census TIGER/Line naming convention:
- `tl_2020_{FIPS}_bg20.shp` where `{FIPS}` is a 5-digit FIPS code (state + county)

## Development

### Code Organization

- **Backend**: Modular structure with separate concerns (validation, data processing, API routes)
- **Frontend**: Component-based architecture with reusable UI components
- **Styling**: CSS classes in `App.css` for maintainability
- **Error Handling**: Comprehensive error handling on both frontend and backend

### Key Design Decisions

- **POST requests**: Used for complex queries to avoid URL length limits
- **Dynamic scales**: Chart axes adapt to data ranges automatically
- **State management**: React hooks for local component state
- **Configuration**: Environment variables for deployment flexibility

### AI Support

#### ChatGPT

I used ChatGPT for some questions in addition to Googling (things you'd find on StackOverflow, syntax, etc.). 
This was particularly helpful to get started working with the geojson files.

#### Claude

I  used Claude for some frontend support, since this is not  my area of expertise. I've found it especially helpful with CSS and JavaScript syntax. I also used it to generate a template for this README.

## Future Enhancements

- Transportation analysis (currently disabled in UI)
- Food access mapping (currently disabled in UI)
- Additional time periods
- Export functionality
- Comparison across multiple cities
- Interactive housing map with household change information

## Limitations

- DataCommon went down Wednesday when I worked on this project, so the data is just from the decenial census. If given more time I would love to migrate to ACS data or the data available in DataCommon.
- The application compares age groups across years instead of age group cohorts (e.g. the 70-74 year olds in 2020 were 60-64 in 2010). If given more time I would add the option to look at cohorts as well.
- The frontend design is rather limited and could benefit from a better design review.
- The insights are generated using a rather primitive method. AI could potentially be powerful here.
- Data is stored locally. If productionized, I would move this to a database.
- No requests or data is cached, which could improve performance if implemented.
- The API doesn't have rate limiting or CORS implemented.
- There are no tests for the application. These would be a high priority to add.
- All features were added in a single commit which is not the proper way to work in version control. Smaller features should've been commited as they were developed.
- Due to human error, not all block groups for every municipality MAPC serves is available. If given more time, this would be essential to get correct.