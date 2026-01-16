import { useState } from 'react';
import AgePopulationPyramid from './AgePopulationPyramid';
import RacePopulationPyramid from './RacePopulationPyramid';

const PopulationPyramid = ({ data, year1, year2, city }) => {
  const [showAge, setShowAge] = useState(true);
  const [showRace, setShowRace] = useState(false);
  const ageData = data.age_group_data;
  const raceData = data.race_group_data;

  return (
    <div className="population-pyramid-container">
      <div className="toggle-container">
        <button 
          className={`toggle-button ${showAge ? 'active' : ''}`}
          onClick={() => setShowAge(!showAge)}
        >
          Age
        </button>
        <button 
          className={`toggle-button ${showRace ? 'active' : ''}`}
          onClick={() => setShowRace(!showRace)}
        >
          Race
        </button>
      </div>

      {showAge && (
        <div>
          <AgePopulationPyramid data={ageData} year1={year1} year2={year2} city={city} />
        </div>
      )}
      {showRace && (
        <div style={{ marginTop: showAge ? '3rem' : '0' }}>
          <RacePopulationPyramid data={raceData} year1={year1} year2={year2} city={city} />
        </div>
      )}
    </div>
)
}

export default PopulationPyramid;