import React, { useState, useEffect } from 'react';
import PopulationPyramid from './components/PopulationPyramid';
import { fetchPopulationData } from './utils/api';
import HousingMap from './components/HousingMap';
import ControlPanel from './components/ControlPanel';
import './App.css';

const DEFAULT_YEAR1 = '2010';
const DEFAULT_YEAR2 = '2020';
const DEFAULT_CITY = 'Somerville';

function App() {
  const [year1, setYear1] = useState(DEFAULT_YEAR1);
  const [year2, setYear2] = useState(DEFAULT_YEAR2);
  const [city, setCity] = useState(DEFAULT_CITY);
  const [pyramidData, setPyramidData] = useState(null);
  const [activeTab, setActiveTab] = useState('population');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchPopulationData(year1, year2, city);
        setPyramidData(data);
      } catch (err) {
        console.error('Error loading population data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [year1, year2, city]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>The Missing Middle</h1>
        <p className="app-subtitle" style={{ marginTop: '0rem' }}>
          Exploring demographic shifts in Massachusetts communities.
        </p>
      </header>

      <ControlPanel 
        year1={year1} 
        year2={year2} 
        city={city} 
        setYear1={setYear1} 
        setYear2={setYear2} 
        setCity={setCity} 
      />

      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === 'population' ? 'active' : ''}`}
          onClick={() => setActiveTab('population')}
        >
          Population
        </button>
        <button 
          className={`tab-button ${activeTab === 'housing' ? 'active' : ''}`}
          onClick={() => setActiveTab('housing')}
        >
          Housing
        </button>
        <button 
          className={`tab-button ${activeTab === 'transportation' ? 'active' : ''}`}
          onClick={() => setActiveTab('transportation')}
          disabled
          style={{ opacity: 0.5, cursor: 'not-allowed' }}
        >
          Transportation
        </button>
        <button 
          className={`tab-button ${activeTab === 'food' ? 'active' : ''}`}
          onClick={() => setActiveTab('food')}
          disabled
          style={{ opacity: 0.5, cursor: 'not-allowed' }}
        >
          Food Access
        </button>
      </div>

      <div className="content-card">
        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading data...</div>
          </div>
        )}
        
        {error && !isLoading && (
          <div className="error-container">
            <h2 className="error-title">Error Loading Data</h2>
            <p className="error-message">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="error-button"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div style={{ display: activeTab === 'population' ? 'block' : 'none' }}>
              <PopulationPyramid data={pyramidData} year1={year1} year2={year2} city={city} />
            </div>
            <div style={{ display: activeTab === 'housing' ? 'block' : 'none' }}>
              <HousingMap 
                year1={year1}
                year2={year2}
                city={city}
                city_change_absolute={pyramidData?.total_city_change?.change}
                city_change_percent={pyramidData?.total_city_change?.percent} 
              />
            </div>
          </>
        )}
      </div>
    </div>  
  );
}

export default App;