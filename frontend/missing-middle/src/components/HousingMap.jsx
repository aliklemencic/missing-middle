import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { fetchHousingData } from "../utils/api";

const HousingMap = ({ year1, year2, city, city_change_absolute, city_change_percent }) => {
  const [housingData, setHousingData] = useState(null);
  const [housingSentences, setHousingSentences] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchHousingData(year1, year2, city, city_change_absolute, city_change_percent);
        setHousingData(data.geojson);
        setHousingSentences(data.sentences);
      } catch (err) {
        console.error('Error loading housing data:', err);
        setError(err.message || 'Failed to load housing data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [year1, year2, city, city_change_absolute, city_change_percent]);

  if (isLoading) {
    return (
      <div className="empty-state">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading housing data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3 className="error-title">Error Loading Housing Data</h3>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!housingData || !housingData.features) {
    return (
      <div className="empty-state">
        <p>No housing data available for this selection.</p>
      </div>
    );
  }

  // Calculate center of city
  const cityFeatures = housingData.features.filter(f => f.properties.TOWN === city);
  
  let centerLon = -71.1;  // Default to Eastern MA
  let centerLat = 42.35;
  
  if (cityFeatures.length > 0) {
    let sumLon = 0;
    let sumLat = 0;
    let totalPoints = 0;
    
    cityFeatures.forEach(feature => {
      if (feature.geometry.type === 'Polygon') {
        const coords = feature.geometry.coordinates[0];
        coords.forEach(([lon, lat]) => {
          sumLon += lon;
          sumLat += lat;
          totalPoints++;
        });
      } else if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach(polygon => {
          polygon[0].forEach(([lon, lat]) => {
            sumLon += lon;
            sumLat += lat;
            totalPoints++;
          });
        });
      }
    });
    
    if (totalPoints > 0) {
      centerLon = sumLon / totalPoints;
      centerLat = sumLat / totalPoints;
    }
  }

  return (
    <div className="housing-map-container">
      {/* Left Column - Housing Supply Map */}
      <div className="housing-map-left">
        <h2 className="section-title">
          Housing Supply Map
        </h2>
        <Plot
          key={`${year1}-${year2}-${city}`}
          data={[
            {
            type: "choropleth",
            geojson: housingData,
            locations: housingData.features.map(f => f.properties.GEOID20),
            z: housingData.features.map(f => f.properties.z ?? -500000000),
            featureidkey: "properties.GEOID20",
            text: housingData.features.map(
              (f) => f.properties.z !== null 
                ? `${f.properties.TOWN}: ${f.properties.housing_units_change} units`
                : `${f.properties.TOWN}`
            ),
            colorscale: [
              [0, 'rgba(255, 255, 255, 0)'],
              [0.0001, '#d1e5f0'],
              [1, '#2166ac']
            ],
            marker: { line: { width: 1, color: "#94a3b8" } },
            hoverinfo: "text",
            zmin: 0,
            zauto: false,
            },
          ]}
          layout={{
            geo: {
              center: { lon: centerLon, lat: centerLat },
              visible: false,
              projection: { type: "mercator", scale: 1200 },
              bgcolor: 'rgba(241, 245, 249, 0.5)',
            },
            margin: { t: 0, b: 0, l: 0, r: 0 },
            paper_bgcolor: 'rgba(241, 245, 249, 0.5)',
            plot_bgcolor: 'rgba(241, 245, 249, 0.5)',
          }}
          style={{ width: "100%", height: "600px" }}
          config={{ responsive: true, displayModeBar: false }}
        />
      </div>

      {/* Right column - Insights */}
      <div className="housing-map-right">
        <div className="insight-text">
          <h3 className="insight-title">
            Key Insights
          </h3>
          {housingSentences && housingSentences.length > 0 ? (
            housingSentences.map((sentence, index) => (
              <p key={index}>{sentence}</p>
            ))
          ) : (
            <p>No insights available for this selection.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HousingMap;